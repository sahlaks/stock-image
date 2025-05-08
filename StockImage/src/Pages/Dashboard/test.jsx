// // import React, { useState } from 'react';

// // export default function ImageRearrange() {
// //   const [images, setImages] = useState([
// //     { id: '1', src: '/placeholder.svg?height=100&width=100', alt: 'Image 1' },
// //     { id: '2', src: '/placeholder.svg?height=100&width=100', alt: 'Image 2' },
// //     { id: '3', src: '/placeholder.svg?height=100&width=100', alt: 'Image 3' },
// //     { id: '4', src: '/placeholder.svg?height=100&width=100', alt: 'Image 4' },
// //   ]);

// //   const [draggedIndex, setDraggedIndex] = useState(null);

// //   const onDragStart = (e, index) => {
// //     setDraggedIndex(index);
// //     e.dataTransfer.effectAllowed = 'move';
// //     e.dataTransfer.setData('text/html', e.target.parentNode);
// //     e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
// //   };

// //   const onDragOver = (index) => {
// //     if (draggedIndex === index) {
// //       return;
// //     }
// //     const newImages = [...images];
// //     const draggedImage = newImages[draggedIndex];
// //     newImages.splice(draggedIndex, 1);
// //     newImages.splice(index, 0, draggedImage);
// //     setImages(newImages);
// //     setDraggedIndex(index);
// //   };

// //   const onDragEnd = () => {
// //     setDraggedIndex(null);
// //   };

// //   const saveOrder = () => {
// //     console.log('New image order:', images);
// //     alert("Your new image order has been saved successfully.");
// //   };

// //   return (
// //     <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
// //       <div className="p-6">
// //         <h2 className="text-2xl font-bold mb-4">Rearrange Images</h2>
// //         <div className="flex flex-wrap gap-4 mb-4">
// //           {images.map((image, index) => (
// //             <div
// //               key={image.id}
// //               draggable
// //               onDragStart={(e) => onDragStart(e, index)}
// //               onDragOver={() => onDragOver(index)}
// //               onDragEnd={onDragEnd}
// //               className="relative group cursor-move"
// //             >
// //               <img
// //                 src={image.src}
// //                 alt={image.alt}
// //                 className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
// //               />
// //               <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
// //                 <span className="text-white text-xs font-semibold">Drag to reorder</span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <button 
// //           onClick={saveOrder} 
// //           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
// //         >
// //           Save New Order
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Edit, Trash2, GripVertical } from 'lucide-react';
// import Header from '../../Components/Header';
// import toast from 'react-hot-toast';
// import { deleteImage, showImages, updateImage } from '../../API/userApi';
// import Modal from '../../Components/modal';

// const DashboardEdit = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState(null);
//   const [isEditOpen, setEditModalOpen] = useState(false);
//   const [imageBeingEdited, setImageBeingEdited] = useState(null);
//   const [newTitle, setNewTitle] = useState("");
//   const [newImage, setNewImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [draggedIndex, setDraggedIndex] = useState(null);

//   const handleEdit = (item) => {
//     setImageBeingEdited(item);
//     setPreviewImage(item.url);
//     setNewTitle(item.title);
//     setNewImage(item.url);
//     setEditModalOpen(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]; 
//     if (file) {
//       const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validImageTypes.includes(file.type)) {
//         toast.error("Only image files are allowed (JPEG, PNG, GIF, WEBP).");
//         return;
//       }
//       setNewImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result); 
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveEdit = async () => {
//     const formData = new FormData();
//     formData.append("title", newTitle);
//     formData.append("id", imageBeingEdited._id);

//     if (newImage) {
//       formData.append("images", newImage);
//     }
//     try {
//       setLoading(true);
//       const res = await updateImage(formData);
//       if (res.success) {
//         toast.success("Image updated successfully!");
//         const updated = res.image;
//         setEditModalOpen(false);
//         setItems(items.map(item => item._id === updated._id ? { ...item, ...updated } : item));
//       } else {
//         toast.error("Failed to update image!");
//       }
//     } catch(err) {
//       toast.error("An error occurred while updating the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditModalOpen(false);
//     setNewTitle("");
//     setNewImage(null);
//   };

//   const confirmDelete = (id) => {
//     setImageToDelete(id);
//     setModalOpen(true); 
//   };

//   const handleDelete = async () => {
//     const res = await deleteImage(imageToDelete);
//     setModalOpen(false);
//     if(res.success){
//       toast.success('Image Deleted!');
//       setItems(items.filter(item => item._id !== imageToDelete));
//     } else {
//       toast.error('Failed to delete!');
//     }
//   };

//   const cancelDelete = () => {
//     setModalOpen(false); 
//   };

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         setLoading(true);
//         const response = await showImages();
//         if (response.success) {
//           setItems(response.images);
//         } else {
//           toast.error("No images found.");
//         }
//       } catch (err) {
//         toast.error("Error fetching images. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   // Drag and Drop functions
//   const onDragStart = (e, index) => {
//     setDraggedIndex(index);
//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('text/html', e.target.parentNode);
//     e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
//   };

//   const onDragOver = (index) => {
//     if (draggedIndex === index) {
//       return;
//     }
//     const newItems = [...items];
//     const draggedItem = newItems[draggedIndex];
//     newItems.splice(draggedIndex, 1);
//     newItems.splice(index, 0, draggedItem);
//     setItems(newItems);
//     setDraggedIndex(index);
//   };

//   const onDragEnd = () => {
//     setDraggedIndex(null);
//   };

//   const saveOrder = async () => {
//     // Implement the API call to save the new order
//     // For now, we'll just log the new order and show a toast
//     console.log('New image order:', items);
//     toast.success("New image order saved successfully!");
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="max-w-7xl w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl mt-12"
//         >
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">Dashboard</h2>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {items && items.length > 0 ? (
//               items.map((item, index) => (
//                 <div 
//                   key={item._id} 
//                   className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg"
//                   draggable
//                   onDragStart={(e) => onDragStart(e, index)}
//                   onDragOver={() => onDragOver(index)}
//                   onDragEnd={onDragEnd}
//                 >
//                   <div className="w-full flex justify-between items-center mb-2">
//                     <GripVertical className="text-gray-400 cursor-move" />
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => confirmDelete(item._id)}
//                         className="text-red-600 hover:text-red-800 focus:outline-none"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                   <img src={item.url} alt={item.title} className="h-full w-full object-contain rounded-md mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-3 flex justify-center items-center w-full h-full">
//                 <p className="text-center text-xl font-semibold text-gray-600">No images available</p>
//               </div>
//             )}
//           </div>
//           {items.length > 1 && (
//             <button 
//               onClick={saveOrder}
//               className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
//             >
//               Save New Order
//             </button>
//           )}
//         </motion.div>

//         {isEditOpen && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
//               <div className="space-y-4">
//                 <input
//                   type="file"
//                   onChange={handleImageChange}
//                   className="file-input"
//                 />
//                 <input
//                   type="text"
//                   value={newTitle}
//                   onChange={(e) => setNewTitle(e.target.value)}
//                   className="input-field"
//                   placeholder="Enter new title"
//                 />
//                 {newImage && (
//                   <img src={previewImage} alt="Preview" className="w-40 h-50" />
//                 )}
//                 <div className="flex space-x-4 mt-4">
//                   <button onClick={handleSaveEdit} className="bg-indigo-600 text-white px-4 py-2 rounded-md">{loading ? "Saving..." : "Save"}</button>
//                   <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <Modal
//           message="Are you sure you want to delete image?"
//           onConfirm={handleDelete}
//           onCancel={cancelDelete}  
//         />
//       )}
//     </>
//   );
// };

// export default DashboardEdit;


// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Edit, Trash2 } from "lucide-react";
// import Header from "../../Components/Header";
// import toast from "react-hot-toast";
// import { deleteImage, showImages, updateImage } from "../../API/userApi";
// import Modal from "../../Components/modal";

// const Dashboard = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState(null);

//   const [isEditOpen, setEditModalOpen] = useState(false);
//   const [imageBeingEdited, setImageBeingEdited] = useState(null);
//   const [newTitle, setNewTitle] = useState("");
//   const [newImage, setNewImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleEdit = (item) => {
//     setImageBeingEdited(item);
//     setPreviewImage(item.url);
//     setNewTitle(item.title);
//     setNewImage(item.url);
//     setEditModalOpen(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validImageTypes = [
//         "image/jpeg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ];
//       if (!validImageTypes.includes(file.type)) {
//         toast.error("Only image files are allowed (JPEG, PNG, GIF, WEBP).");
//         return;
//       }
//       setNewImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveEdit = async () => {
//     const formData = new FormData();
//     formData.append("title", newTitle);
//     formData.append("id", imageBeingEdited._id);

//     if (newImage) {
//       formData.append("images", newImage);
//     }
//     try {
//       setLoading(true);
//       const res = await updateImage(formData);
//       if (res.success) {
//         toast.success("Image updated successfully!");
//         const updated = res.image;
//         setEditModalOpen(false);
//         setItems(
//           items.map((item) =>
//             item._id === updated._id ? { ...item, ...updated } : item
//           )
//         );
//       } else {
//         toast.error("Failed to update image!");
//       }
//     } catch (err) {
//       toast.error("An error occurred while updating the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditModalOpen(false);
//     setNewTitle("");
//     setNewImage(null);
//   };

//   /*...........Delete................*/
//   const confirmDelete = (id) => {
//     console.log(id);
//     setImageToDelete(id);
//     setModalOpen(true);
//   };

//   const handleDelete = async () => {
//     const res = await deleteImage(imageToDelete);
//     setModalOpen(false);
//     if (res.success) {
//       toast.success("Image Deleted!");
//       setItems(items.filter((item) => item._id !== imageToDelete));
//     } else {
//       toast.error("Failed to delete!");
//     }
//   };

//   const cancelDelete = () => {
//     setModalOpen(false);
//   };

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         setLoading(true);
//         const response = await showImages();
//         if (response.success) {
//           setItems(response.images);
//         } else {
//           toast.error("No images found.");
//         }
//       } catch (err) {
//         toast.error("Error fetching images. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   // Drag and Drop functions
//   const onDragStart = (e, index) => {
//     setDraggedIndex(index);
//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('text/html', e.target.parentNode);
//     e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
//   };

//   const onDragOver = (index) => {
//     if (draggedIndex === index) {
//       return;
//     }
//     const newItems = [...items];
//     const draggedItem = newItems[draggedIndex];
//     newItems.splice(draggedIndex, 1);
//     newItems.splice(index, 0, draggedItem);
//     setItems(newItems);
//     setDraggedIndex(index);
//   };

//   const onDragEnd = () => {
//     setDraggedIndex(null);
//   };

//   const saveOrder = async () => {
//     // Implement the API call to save the new order
//     // For now, we'll just log the new order and show a toast
//     console.log('New image order:', items);
//     toast.success("New image order saved successfully!");
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: -50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="max-w-7xl w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl mt-12"
//         >
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">
//             Dashboard
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {items && items.length > 0 ? (
//               items.map((item,index) => (
//                 <div
//                   key={item._id}
//                   className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg"
//                   draggable
//                   onDragStart={(e) => onDragStart(e, index)}
//                   onDragOver={() => onDragOver(index)}
//                   onDragEnd={onDragEnd}
//                 >
//                   <img
//                     src={item.url}
//                     alt={item.title}
//                     className="h-full w-full object-contain rounded-md mb-4"
//                   />
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     {item.title}
//                   </h3>
//                   <div className="flex space-x-4 mt-4">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
//                     >
//                       <Edit className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => confirmDelete(item._id)}
//                       className="text-red-600 hover:text-red-800 focus:outline-none"
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex justify-center items-center w-full h-full">
//                 <p className="text-center text-xl font-semibold text-gray-600">
//                   No images available
//                 </p>
//               </div>
//             )}
//           </div>
//         </motion.div>

//         {isEditOpen && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
//               <div className="space-y-4">
//                 <input
//                   type="file"
//                   onChange={handleImageChange}
//                   className="file-input"
//                 />
//                 <input
//                   type="text"
//                   value={newTitle}
//                   onChange={(e) => setNewTitle(e.target.value)}
//                   className="input-field"
//                   placeholder="Enter new title"
//                 />
//                 {newImage && (
//                   <img
//                     src={previewImage}
//                     alt="Preview"
//                     className=" w-40 h-50"
//                   />
//                 )}
//                 <div className="flex space-x-4 mt-4">
//                   <button
//                     onClick={handleSaveEdit}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-md"
//                   >
//                     {loading ? "Saving..." : "Save"}
//                   </button>
//                   <button
//                     onClick={handleCancelEdit}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <Modal
//           message="Are you sure you want to delete image?"
//           onConfirm={handleDelete}
//           onCancel={cancelDelete}
//         />
//       )}
//     </>
//   );
// };

// export default Dashboard;

