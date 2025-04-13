import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const HomePage = () => {
  const { tasks, getTasks, sendFile } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    sendFile(formData);
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div>
      <input
        type="file"
        className="file-input file-input-secondary m-10"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <button className="btn btn-secondary" onClick={handleUpload}>
          Send
        </button>
      )}
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">All tasks</li>

        {tasks &&
          tasks.map((task, index) => (
            <li key={task.id} className="list-row">
              <div className="text-4xl font-thin opacity-30 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">
                  File Path: {task.filePath}
                </p>
                <p className="text-xs text-gray-500">Status: {task.status}</p>
                <p className="text-xs text-gray-500">
                  Created At: {task.createdAt}
                </p>
                {task.error && (
                  <p className="text-xs text-red-500">Error: {task.error}</p>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
