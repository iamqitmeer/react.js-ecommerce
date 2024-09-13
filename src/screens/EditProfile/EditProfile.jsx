import React, { useState } from "react";
import { Input, Button, Textarea, Select, DatePicker } from "@nextui-org/react"; // NextUI components

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(null);
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Profile</h1>

        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
              src={profileImage}
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute bottom-0 right-0 opacity-0 w-24 h-24 cursor-pointer"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
              <i class="ri-camera-2-lineh-6 w-6"></i>
            </button>
          </div>
          <div className="ml-4 flex-1">
            <Input
              clearable
              bordered
              color="primary"
              label="Full Name"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mb-4"
            />

            <DatePicker
              clearable
              bordered
              color="primary"
              label="Date of Birth"
              placeholder="Select Date of Birth"
              value={dob}
              onChange={(date) => setDob(date)}
              className="mb-4"
            />

            <Select
              bordered
              color="primary"
              label="Category"
              placeholder="Select a Category"
              value={category}
              onChange={(e) => setCategory(e)}
              className="mb-4"
            >
              <Select.Option value="Technology">Technology</Select.Option>
              <Select.Option value="Science">Science</Select.Option>
              <Select.Option value="Art">Art</Select.Option>
            </Select>

            <Input
              clearable
              bordered
              color="primary"
              label="Email"
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />

            <Button
              color="primary"
              size="lg"
              className="w-full"
              onClick={() => alert("Save Changes Clicked")}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            color="secondary"
            size="lg"
            className="w-full"
            onClick={() => alert("Cancel Clicked")}
          >
            Cancel
          </Button>
          <Button
            color="success"
            size="lg"
            className="w-full"
            onClick={() => alert("Save Clicked")}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
