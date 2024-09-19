import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db, provider, storage } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { DatePicker, Select, SelectItem } from "@nextui-org/react";
import { addDoc, setDoc, collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Register() {
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [fullName, setFullName] = useState("");
  let [profileImage, setProfileImage] = useState("");
  let [dateOfBirth, setDateOfBirth] = useState("");
  let [category, setCategory] = useState("");
  let [phoneNumber, setPhoneNumber] = useState();
  let [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      console.log("User is signed out");
    }
  });

  async function registerUser() {
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      let profileImageUrl = null;

      // Upload profile image if selected
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${uid}`);
        const snapshot = await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(snapshot.ref);
      }

      // Save user data in Firestore
      await setDoc(doc(db, "users", uid), {
        fullName,
        email,
        profileImageUrl,
        phoneNumber,
        dateOfBirth,
        category,
      });

      navigate("/");
      setLoading(false);
    } catch (error) {
      console.error("Error registering user:", error);
      setLoading(false);
    }
  }

  function handleUpload(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProfileImage(selectedFile);
    }
  }

  function handleCategory(event) {
    setCategory(event.target.value);
  }

  function handleDOBPicker(event) {
    setDateOfBirth(new Date(event.month + "/" + event.day + "/" + event.year));
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-12">
      <div className="flex flex-col items-center justify-center m-12 px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>

            <div className="flex flex-col space-y-4 md:space-y-6">
          
              <div className="space-y-4 md:space-y-6">
                <label
                  htmlFor="profile_image"
                  className="block relative w-full p-4 bg-white border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition ease-in-out duration-300"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-8 h-8 text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7l9 9 9-9"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      Upload Profile Image
                    </span>
                  </div>
                  <input
                    id="profile_image"
                    type="file"
                    onChange={handleUpload} // Handle the file selection
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    aria-describedby="file_input_help"
                  />
                </label>
                {profileImage ? (
                  <p className="mt-2 text-blue-600 text-xs">
                    {profileImage.name}
                  </p>
                ) : (
                  <p
                    id="file_input_help"
                    className="mt-2 text-xs text-gray-500 dark:text-gray-400"
                  >
                    PNG, JPG, or JPEG (Max. 5MB)
                  </p>
                )}

                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    id="fullName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="+92xxxxxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/2">
                    <DatePicker
                      onChange={handleDOBPicker}
                      label="Birth date"
                      className="w-full"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Select
                      label="Category"
                      placeholder="Select an Category"
                      onChange={handleCategory}
                      className="w-full"
                    >
                      <SelectItem key={"Electronics"}>Electronics</SelectItem>
                      <SelectItem key={"Clothing"}>Clothing</SelectItem>
                      <SelectItem key={"Home Appliances"}>
                        Home Appliances
                      </SelectItem>
                      <SelectItem key={"Books"}>Books</SelectItem>
                      <SelectItem key={"Toys"}>Toys</SelectItem>
                      <SelectItem key={"Sports"}>Sports</SelectItem>
                      <SelectItem key={"Beauty"}>Beauty</SelectItem>
                      <SelectItem key={"Health"}>Health</SelectItem>
                      <SelectItem key={"Automotive"}>Automotive</SelectItem>
                      <SelectItem key={"Furniture"}>Furniture</SelectItem>
                      <SelectItem key={"Jewelry"}>Jewelry</SelectItem>
                      <SelectItem key={"Garden"}>Garden</SelectItem>
                      <SelectItem key={"Office Supplies"}>
                        Office Supplies
                      </SelectItem>
                      <SelectItem key={"Baby"}>Baby Products</SelectItem>
                      <SelectItem key={"Pet"}>Pet Supplies</SelectItem>
                      <SelectItem key={"Shoes"}>Shoes</SelectItem>
                      <SelectItem key={"Kitchenware"}>Kitchenware</SelectItem>
                      <SelectItem key={"Outdoor"}>Outdoor</SelectItem>
                      <SelectItem key={"Art"}>Art</SelectItem>
                      <SelectItem key={"Music"}>Music</SelectItem>
                      <SelectItem key={"Handmade"}>Handmade</SelectItem>
                    </Select>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-violet-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-violet-600"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-violet-600 hover:underline dark:text-violet-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <button
                disabled={loading}
                  onClick={registerUser}
                  type="submit"
                  className={`w-full text-white ${
                    loading
                      ? "bg-violet-200 text-black hover:bg-violet-200"
                      : "bg-violet-600 hover:bg-violet-700"
                  } focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5`}
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="font-medium text-violet-600 hover:underline dark:text-violet-500"
                  >
                    Login here
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
