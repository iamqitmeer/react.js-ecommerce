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

      setLoading(false);
      navigate("/");
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

  function registerWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
      });
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
              <div className="flex justify-center space-x-4">
                <button
                  onClick={registerWithGoogle}
                  type="button"
                  className="flex items-center text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Register with Google
                </button>
                <button
                  type="button"
                  className="flex items-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="github"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 496 512"
                  >
                    <path
                      fill="currentColor"
                      d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                    ></path>
                  </svg>
                  Register with Github
                </button>
              </div>

              <p className="text-center text-[10px]">────── OR ──────</p>

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
