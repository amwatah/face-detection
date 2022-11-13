import { Button } from "@mantine/core";
import Head from "next/head";
import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { MdCameraswitch } from "react-icons/md";

import { Loader } from "@mantine/core";

const Home = () => {
  const [picture, setPicture] = useState("");
  const [confirmedStatus, setConfirmedStatus] = useState("not-started");
  const [detectedFace, setDetectedFace] = useState({});
  const [camera, setCamera] = useState("user");
  const webcamRef = React.useRef();
  const imageRef = useRef();
  const capture = useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  }, [imageRef]);

  async function runFaceDetection() {
    setConfirmedStatus("started");
    await faceapi.loadSsdMobilenetv1Model("/models");
    await faceapi.loadAgeGenderModel("/models");
    const detections = await faceapi
      .detectSingleFace(imageRef.current)
      .withAgeAndGender();
    console.log(detections);
    setDetectedFace(detections);
    setConfirmedStatus("finished");
  }

  return (
    <div className="flex min-h-screen flex-col items-center  py-2">
      <Head>
        <title>GROUP FOUR PROJECT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" flex flex-col items-center">
        <h3>GROUP FOUR FACE DETECTION PROJECT</h3>
        <h4>PLACE YOUR FACE IN CENTER</h4>
        <button
          onClick={() => {
            setCamera(camera === "user" ? "environment" : "user");
          }}
          className=" text-lg"
        >
          <MdCameraswitch />
        </button>

        <div>
          {picture == "" ? (
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              width={400}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 400,
                height: 400,
                facingMode: camera,
              }}
              className="rounded-full"
            />
          ) : (
            <img ref={imageRef} src={picture} className=" rounded-full" />
          )}
        </div>
        <div>
          {picture != "" ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setPicture("");
              }}
            >
              Retake
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
            >
              Capture
            </Button>
          )}
        </div>
        <Button onClick={runFaceDetection} className=" m-3">
          COMPUTE FACE
        </Button>
        <section className=" results">
          {confirmedStatus === "started" && <Loader size="xl" variant="bars" />}
          {confirmedStatus === "finished" && !(detectedFace === undefined) && (
            <div className=" flex flex-col items-center">
              <h4>GENDER</h4>
              <h2 className=" uppercase font-bold">{detectedFace.gender}</h2>
              <h4> PROBABILITY</h4>
              <h2>{detectedFace.genderProbability * 100} %</h2>
            </div>
          )}
          {confirmedStatus === "finished" && detectedFace === undefined && (
            <div className=" text-center">
              <h3 className=" text-red-800">
                FACE RECOGNITION FAILED !! TRY AGAIN
              </h3>
              <p className=" uppercase">
                adjust your face ama ununue camera ingine
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
