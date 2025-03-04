"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";

const AddPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expiryDate: null,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, expiryDate: date }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("name",formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("expiryDate", formData.expiryDate);
    if (formData.file) {
        formDataObj.append("file", formData.file);
      }
    console.log("Submitted Data: ", formData);
    try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataObj,
        });
        if (response.ok) {
          toast.success("File uploaded successfully!");
          router.push("/");
        } else {
          toast.error("Failed to upload file.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      }
  };

  const handleClear = () => {
    setFormData({ name: "", description: "", expiryDate: null, file: null });
  };

  return (
    <div className="max-w-6xl mx-auto pt-6">
      <p>Please fill in the below and Attach the document</p>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Submit Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Date of Expiry</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between"
                  >
                    {formData.expiryDate
                      ? format(formData.expiryDate, "PPP")
                      : "Pick a date"}
                    <CalendarIcon className="ml-2 h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={handleDateChange}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Attach Document</Label>
              <Input type="file" onChange={handleFileChange} />
            </div>
            <div className="flex justify-between">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPage;
