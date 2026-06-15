import { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Documents</h1>
      <DocumentUpload onUploadSuccess={() => setRefresh(r => r + 1)} />
    </div>
  );
};

export default Dashboard;