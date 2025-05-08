import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import Header from '../../Components/Header';
import { uploadImages } from '../../API/userApi';
import toast from 'react-hot-toast';

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 ${className}`}
    ref={ref}
    {...props}
  />
));

export default function ImageUploadPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
   
  
    const newImages = files.map((file) => {
      let error = null;
  
      if (!validImageTypes.includes(file.type)) {
        error = "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.";
      } 
  
      return {
        file,
        preview: URL.createObjectURL(file),
        name: '',
        error,
      };
    });
  
    setImages((prev) => [...prev, ...newImages]);
  };
  

  
  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  
  const handleNameChange = (index, newName) => {
    setImages((prev) =>
      prev.map((image, i) =>
        i === index ? { ...image, name: newName } : image
      )
    );
  };

  
  const handleSave = async () => {
    if (images.length === 0) {
      toast.error("Please select images to upload.");
      return;
    }

    const imageData = images.map(({ file, name }) => ({ file, name }));
    
    if (imageData.some(({ name }) => !name)) {
        toast.error('Please provide names for all images!');
        return;
    }

    const formData = new FormData();
    imageData.forEach(({ file, name }, index) => {
        formData.append('images', file); 
        formData.append(`title_${index}`, name); 
    });

    try{
    setLoading(true)
    const result = await uploadImages(formData);
    if(result.success){
      toast.success('Images Uploaded Successfully!!')
      setImages([])
    }
  }catch(error){
    const serverMessage =
    error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : "Something went wrong. Please try again.";
  toast.error(serverMessage);
  } finally {
    setLoading(false)
  }
};


  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Upload Images with Names
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select images for uploading!
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="h-8 w-8 text-indigo-600" />
              <span className="mt-2 text-sm text-gray-600">Click to upload</span>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="rounded-lg w-24 h-24 object-cover shadow"
                />
                <Input
                  type="text"
                  placeholder="Enter image name"
                  value={image.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="flex-grow"
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                {image.error && (
      <p className="text-red-500 text-sm mt-1">{image.error}</p>
    )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}> {loading ? "Saving..." : "Save"}</Button>
        </div>
      </motion.div>
    </div>
    </>
  );
}
