"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Share2Icon, DownloadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BeatLoader } from "react-spinners";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  useEffect(() => {
    async function fetchFiles() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        setUploadedFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
      setIsLoading(false);
    }
    fetchFiles();
  }, []);

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareFile = (fileUrl) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this document",
          text: "Here's a document I uploaded:",
          url: fileUrl,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(fileUrl)}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-32 flex justify-center items-center">
        <BeatLoader />
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFiles.length > 0 ? (
                  currentFiles.map((file) => (
                    <TableRow key={file._id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.description}</TableCell>
                      <TableCell>{format(new Date(file.expiryDate), "PPP")}</TableCell>
                      <TableCell className="flex gap-x-2">
                        <Button
                          className="group cursor-pointer"
                          variant="outline"
                          onClick={() => downloadFile(file.fileUrl, file.name)}
                        >
                          <DownloadIcon className="group-hover:text-green-500 mr-2 h-5 w-5" /> Download
                        </Button>
                        <Button
                          className="group cursor-pointer"
                          variant="outline"
                          onClick={() => shareFile(file.fileUrl)}
                        >
                          <Share2Icon className="mr-2 h-5 w-5 group-hover:text-sky-500" />
                          Share
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No files uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className='cursor-pointer'
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>
                <PaginationItem>
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className='cursor-pointer'
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
