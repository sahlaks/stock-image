import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import Header from '../../Components/Header';
import toast from 'react-hot-toast';
import { deleteImage, savePosition, showImages, updateImage } from '../../API/userApi';
import Modal from '../../Components/modal';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isEditOpen, setEditModalOpen] = useState(false);
  const [imageBeingEdited, setImageBeingEdited] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleEdit = (item) => {
    setImageBeingEdited(item);
    setPreviewImage(item.url);
    setNewTitle(item.title);
    setNewImage(item.url);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Only image files are allowed (JPEG, PNG, GIF, WEBP).");
        return;
      }
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("id", imageBeingEdited._id);

    if (newImage) {
      formData.append("images", newImage);
    }
    
    try {
      setLoading(true);
      const res = await updateImage(formData);
      if (res.success) {
        toast.success("Image updated successfully!");
        const updated = res.image;
        setEditModalOpen(false);
        setItems(items.map(item => item._id === updated._id ? { ...item, ...updated } : item));
      } else {
        toast.error("Failed to update image!");
      }
    } catch(err) {
      toast.error("An error occurred while updating the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setNewTitle("");
    setNewImage(null);
  };

  const confirmDelete = (id) => {
    setImageToDelete(id);
    setModalOpen(true); 
  };

  const handleDelete = async () => {
    const res = await deleteImage(imageToDelete);
    setModalOpen(false);
    if(res.success){
      toast.success('Image Deleted!');
      setItems(items.filter(item => item._id !== imageToDelete));
    } else {
      toast.error('Failed to delete!');
    }
  };

  const cancelDelete = () => {
    setModalOpen(false); 
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await showImages();
        if (response.success) {
          const sortedImages = response.images.sort((a, b) => a.position - b.position);
          setItems(sortedImages);
        } else {
          toast.error("No images found.");
        }
      } catch (err) {
        toast.error("Error fetching images. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Drag and Drop functions
  const onDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOver = (index) => {
    if (draggedIndex === index) {
      return;
    }
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setItems(newItems);
    setDraggedIndex(index);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  const saveOrder = async () => {
    const reorderedImages = items.map((item, index) => ({
      id: item._id,
      position: index + 1,
    }));
  
    try {
      const result = await savePosition(reorderedImages);
      if (result.success) {
        toast.success("New image order saved successfully!");
      } else {
        toast.error("Failed to save new order.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the order.");
    }
  };
  

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl mt-12"
        >
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Dashboard</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div 
                  key={item._id} 
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg"
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={() => onDragOver(index)}
                  onDragEnd={onDragEnd}
                >
                  <div className="w-full flex justify-between items-center mb-2">
                    <GripVertical className="text-gray-400 cursor-move" />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(item._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <img src={item.url} alt={item.title} className="rounded-md mb-4 max-w-[350px] max-h-[350px] object-cover" />
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex justify-center items-center w-full h-full">
                <p className="text-center text-xl font-semibold text-gray-600">No images available</p>
              </div>
            )}
          </div>
          {items.length > 1 && (
            <button 
              onClick={saveOrder}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Save New Order
            </button>
          )}
        </motion.div>

        {isEditOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter new title"
                />
                {newImage && (
                  <img src={previewImage} alt="Preview" className="w-40 h-50" />
                )}
                <div className="flex space-x-4 mt-4">
                  <button onClick={handleSaveEdit} className="bg-indigo-600 text-white px-4 py-2 rounded-md">{loading ? "Saving..." : "Save"}</button>
                  <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          message="Are you sure you want to delete image?"
          onConfirm={handleDelete}
          onCancel={cancelDelete}  
        />
      )}
    </>
  );
};

export default Dashboard;




