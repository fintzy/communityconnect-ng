import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  MapPin,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { store } from "../services/store";

type GPSLocation = {
  latitude: number;
  longitude: number;
};

const CATEGORIES = [
  { value: "roads", label: "Roads" },
  { value: "water", label: "Water" },
  { value: "power", label: "Power" },
  { value: "sanitation", label: "Sanitation" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
] as const;

type CategoryValue =
  (typeof CATEGORIES)[number]["value"];

export default function ReportIncident() {
  const navigate = useNavigate();

  // ============================================================
  // CAMERA REFERENCES
  // ============================================================

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  // ============================================================
  // CAMERA STATE
  // ============================================================

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [photo, setPhoto] =
    useState<string | null>(null);

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [cameraError, setCameraError] =
    useState("");

  // ============================================================
  // GPS STATE
  // ============================================================

  const [gps, setGps] =
    useState<GPSLocation | null>(null);

  const [gpsLoading, setGpsLoading] =
    useState(false);

  const [gpsError, setGpsError] =
    useState("");

  // ============================================================
  // FORM STATE
  // ============================================================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState<CategoryValue>("roads");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // ============================================================
  // CURRENT USER
  // ============================================================

  const currentUser =
    store.getCurrentUser();

  // ============================================================
  // AUTH CHECK
  // ============================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  // ============================================================
  // CAMERA CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ============================================================
  // ATTACH CAMERA STREAM AFTER VIDEO MOUNTS
  //
  // IMPORTANT:
  // The previous version tried to attach the stream before
  // the <video> element existed. This effect fixes that.
  // ============================================================

  useEffect(() => {
    if (
      !cameraOpen ||
      !streamRef.current ||
      !videoRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const stream = streamRef.current;

    setCameraReady(false);

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    const startPlayback = async () => {
      try {
        await video.play();

        if (
          video.videoWidth > 0 &&
          video.videoHeight > 0
        ) {
          setCameraReady(true);
          setCameraLoading(false);
        }
      } catch (error) {
        console.error(
          "Video playback error:",
          error
        );

        setCameraError(
          "The camera opened but the video preview could not start. Please try again."
        );

        setCameraLoading(false);
      }
    };

    void startPlayback();

    return () => {
      video.pause();
    };
  }, [cameraOpen]);

  // ============================================================
  // CAMERA READY EVENTS
  // ============================================================

  function handleVideoReady() {
    const video = videoRef.current;

    if (
      video &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      setCameraReady(true);
      setCameraLoading(false);
      setCameraError("");
    }
  }

  // ============================================================
  // OPEN CAMERA
  // ============================================================

  async function openCamera() {
    try {
      setCameraError("");
      setCameraReady(false);
      setCameraLoading(true);

      // Stop any previous stream first.
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser."
        );

        setCameraLoading(false);
        return;
      }

      /*
       * Request the device camera.
       *
       * `environment` prefers the rear camera on phones.
       * There is intentionally only ONE camera option.
       */
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      /*
       * IMPORTANT:
       *
       * We set cameraOpen AFTER obtaining the stream.
       * The useEffect above then waits for React to mount
       * the <video> element before attaching the stream.
       */
      setCameraOpen(true);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraLoading(false);
      setCameraReady(false);
      setCameraOpen(false);

      if (
        error instanceof DOMException
      ) {
        if (
          error.name ===
          "NotAllowedError"
        ) {
          setCameraError(
            "Camera permission was denied. Please allow camera access in your browser and try again."
          );

          return;
        }

        if (
          error.name ===
          "NotFoundError"
        ) {
          setCameraError(
            "No camera was found on this device."
          );

          return;
        }

        if (
          error.name ===
          "NotReadableError"
        ) {
          setCameraError(
            "The camera is already being used by another application. Close it and try again."
          );

          return;
        }

        if (
          error.name ===
          "SecurityError"
        ) {
          setCameraError(
            "Camera access was blocked by the browser security settings."
          );

          return;
        }
      }

      setCameraError(
        "Camera access was denied or is unavailable. Please allow camera access and try again."
      );
    }
  }

  // ============================================================
  // STOP CAMERA
  // ============================================================

  function stopCamera() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setCameraOpen(false);
    setCameraReady(false);
    setCameraLoading(false);
  }

  // ============================================================
  // CAPTURE PHOTO
  // ============================================================

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (
      !cameraReady ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        "Camera is not ready yet. Please wait a moment and try again."
      );

      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Unable to capture the camera image."
      );

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    setPhoto(imageData);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File(
          [blob],
          `incident-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setPhotoFile(file);
      },
      "image/jpeg",
      0.9
    );

    stopCamera();
  }

  // ============================================================
  // RETAKE PHOTO
  // ============================================================

  function retakePhoto() {
    setPhoto(null);
    setPhotoFile(null);
    setCameraError("");
    setCameraReady(false);

    void openCamera();
  }

  // ============================================================
  // GPS LOCATION
  // ============================================================

  function getGPSLocation() {
    setGpsLoading(true);
    setGpsError("");

    if (!navigator.geolocation) {
      setGpsError(
        "Geolocation is not supported by this browser."
      );

      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGps({
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude,
        });

        setGpsLoading(false);
      },
      (error) => {
        console.error(
          "GPS error:",
          error
        );

        let message =
          "Unable to get your location. Please allow location access and try again.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser settings.";
        }

        if (error.code === 2) {
          message =
            "Your location could not be determined. Please try again.";
        }

        if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setGpsError(message);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  // ============================================================
  // SUBMIT REPORT
  // ============================================================

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError("");

    if (!title.trim()) {
      setSubmitError(
        "Please enter an incident title."
      );

      return;
    }

    if (!description.trim()) {
      setSubmitError(
        "Please describe the incident."
      );

      return;
    }

    if (!gps) {
      setSubmitError(
        "Please capture the incident location before submitting."
      );

      return;
    }

    if (!currentUser) {
      setSubmitError(
        "Unable to submit report. Please sign in again."
      );

      return;
    }

    setSubmitting(true);

    try {
      store.createReport({
        userId: currentUser.id,
        userName: currentUser.name,
        title: title.trim(),
        description: description.trim(),
        category,
        ward: currentUser.ward,
        lga: currentUser.lga,

        // Evidence
        photo: photo ?? undefined,

        // GPS
        latitude: gps.latitude,
        longitude: gps.longitude,
      });

      console.log(
        "Incident evidence:",
        {
          photo,
          photoFile,
        }
      );

      console.log(
        "Incident GPS:",
        gps
      );

      setSuccess(true);

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(
        "Report submission error:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit the report."
      );

      setSubmitting(false);
    }
  }

  // ============================================================
  // NO USER
  // ============================================================

  if (!currentUser) {
    return null;
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#06130f] dark:text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F4C3A] hover:underline dark:text-[#5ee0b5]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0F4C3A] dark:text-[#5ee0b5]">
            CommunityConnect NG
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Report an Incident
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Capture evidence and location
            information directly from your
            device.
          </p>
        </div>

        {/* ======================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">
            <CheckCircle className="h-5 w-5" />

            <div>
              <p className="font-semibold">
                Report submitted successfully.
              </p>

              <p className="text-sm">
                Returning to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            CAMERA SECTION
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-white/10 dark:bg-[#0d241c]">

          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Evidence
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Take a photo of the incident
              using your device camera.
            </p>
          </div>

          <div className="p-5">

            {/* ==================================================
                OPEN CAMERA
            ================================================== */}

            {!cameraOpen && !photo && (
              <button
                type="button"
                onClick={() =>
                  void openCamera()
                }
                disabled={cameraLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-4 font-semibold text-white transition hover:bg-[#0a3a2c] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0f5f49] dark:hover:bg-[#147258]"
              >
                <Camera className="h-5 w-5" />

                {cameraLoading
                  ? "Opening Camera..."
                  : "Open Camera"}
              </button>
            )}

            {/* ==================================================
                LIVE CAMERA
            ================================================== */}

            {cameraOpen && (
              <div className="space-y-4">

                <div className="relative overflow-hidden rounded-xl bg-black">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={
                      handleVideoReady
                    }
                    onCanPlay={
                      handleVideoReady
                    }
                    className="aspect-video w-full object-cover"
                  />

                  {/* Loading overlay */}

                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center text-white">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <p className="text-sm">
                          Starting camera...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">

                  {/* TAKE PHOTO */}

                  <button
                    type="button"
                    onClick={
                      capturePhoto
                    }
                    disabled={!cameraReady}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-3 font-semibold text-white transition hover:bg-[#0a3a2c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0f5f49] dark:hover:bg-[#147258]"
                  >
                    <Camera className="h-5 w-5" />

                    {cameraReady
                      ? "Take Photo"
                      : "Camera Loading..."}
                  </button>

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={
                      stopCamera
                    }
                    className="rounded-xl border border-gray-200 px-5 py-3 text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                CAPTURED PHOTO
            ================================================== */}

            {photo && (
              <div className="space-y-4">

                <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-black">
                  <img
                    src={photo}
                    alt="Captured incident"
                    className="max-h-[500px] w-full object-contain"
                  />
                </div>

                <div className="flex gap-3">

                  {/* RETAKE */}

                  <button
                    type="button"
                    onClick={
                      retakePhoto
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <RefreshCw className="h-4 w-4" />

                    Retake
                  </button>

                  {/* CAPTURE STATUS */}

                  <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-medium text-green-600 dark:bg-green-950/40 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />

                    Photo captured
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                CAMERA ERROR
            ================================================== */}

            {cameraError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <p>{cameraError}</p>
              </div>
            )}

            {/* Hidden canvas */}

            <canvas
              ref={canvasRef}
              className="hidden"
            />
          </div>
        </section>

        {/* ======================================================
            GPS SECTION
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-white/10 dark:bg-[#0d241c]">

          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Location
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use your device GPS to record
              where the incident occurred.
            </p>
          </div>

          <div className="p-5">

            {!gps && (
              <button
                type="button"
                onClick={
                  getGPSLocation
                }
                disabled={gpsLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-4 font-semibold text-white transition hover:bg-[#0a3a2c] disabled:opacity-50 dark:bg-[#0f5f49] dark:hover:bg-[#147258]"
              >
                <MapPin className="h-5 w-5" />

                {gpsLoading
                  ? "Getting your location..."
                  : "Get My Location"}
              </button>
            )}

            {gps && (
              <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/30">

                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />

                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Location captured
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <div className="rounded-lg bg-white p-3 dark:bg-[#102a21]">
                    <p className="text-xs text-gray-400">
                      Latitude
                    </p>

                    <p className="mt-1 font-mono text-sm text-gray-800 dark:text-gray-200">
                      {gps.latitude.toFixed(
                        6
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 dark:bg-[#102a21]">
                    <p className="text-xs text-gray-400">
                      Longitude
                    </p>

                    <p className="mt-1 font-mono text-sm text-gray-800 dark:text-gray-200">
                      {gps.longitude.toFixed(
                        6
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    getGPSLocation
                  }
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0F4C3A] hover:underline dark:text-[#5ee0b5]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />

                  Refresh location
                </button>
              </div>
            )}

            {gpsError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <p>{gpsError}</p>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================
            INCIDENT FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-white/10 dark:bg-[#0d241c]"
        >

          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Details
            </h2>
          </div>

          <div className="space-y-5 p-5">

            {/* ==================================================
                TITLE
            ================================================== */}

            <div>
              <label
                htmlFor="incident-title"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Incident Title
              </label>

              <input
                id="incident-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Damaged road near market"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#102a21] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#5ee0b5] dark:focus:ring-[#5ee0b5]/20"
                required
              />
            </div>

            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div>
              <label
                htmlFor="incident-category"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>

              <select
                id="incident-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as CategoryValue
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#102a21] dark:text-white dark:focus:border-[#5ee0b5] dark:focus:ring-[#5ee0b5]/20"
              >
                {CATEGORIES.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* ==================================================
                WARD
            ================================================== */}

            <div>
              <label
                htmlFor="incident-ward"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ward
              </label>

              <input
                id="incident-ward"
                type="text"
                value={
                  currentUser.ward
                }
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-white/10 dark:bg-[#091c16] dark:text-gray-400"
              />
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div>
              <label
                htmlFor="incident-description"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>

              <textarea
                id="incident-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={5}
                maxLength={500}
                placeholder="Describe what happened..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#102a21] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#5ee0b5] dark:focus:ring-[#5ee0b5]/20"
                required
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {description.length}/500
              </p>
            </div>

            {/* ==================================================
                CAPTURE STATUS
            ================================================== */}

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#091c16]">

              <p className="font-medium text-gray-800 dark:text-gray-200">
                Report status
              </p>

              <div className="mt-3 space-y-2 text-sm">

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Camera evidence
                  </span>

                  <span
                    className={
                      photo
                        ? "font-medium text-green-600 dark:text-green-400"
                        : "font-medium text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {photo
                      ? "Captured"
                      : "Not captured"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    GPS location
                  </span>

                  <span
                    className={
                      gps
                        ? "font-medium text-green-600 dark:text-green-400"
                        : "font-medium text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {gps
                      ? "Captured"
                      : "Not captured"}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                SUBMIT ERROR
            ================================================== */}

            {submitError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <p>{submitError}</p>
              </div>
            )}

            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={
                submitting ||
                success
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-4 font-semibold text-white transition hover:bg-[#0a3a2c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0f5f49] dark:hover:bg-[#147258]"
            >
              {submitting
                ? "Submitting Report..."
                : "Submit Incident Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}