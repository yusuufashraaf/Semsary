import { useState, useEffect } from "react";
import { Card, Form, Button, Image, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { ImageFormType, imageSchema } from "@validations/imageSchema";
import ActUploadId from "@store/Auth/Act/ActUploadId";
import { resetUI } from "@store/Auth/AuthSlice";
import { toast } from "react-toastify";

const UploadId = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.Authslice);

  const userId = user?.id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ImageFormType>({
    resolver: zodResolver(imageSchema),
  });

  const imageFile = watch("id_image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);


  const handleImageSubmit = (data: ImageFormType) => {
    if (!userId) return toast.error("User ID is missing.");

    const formData = new FormData();
    formData.append("id_image", data.id_image[0]);
    formData.append("user_id", String(userId));

    dispatch(ActUploadId(formData))
      .unwrap()
      .then(() => {
        toast.success("ID uploaded successfully.");
      })
      .catch((err) => toast.error(err || "Failed to upload ID."));
  };

  return (
    <Card className="mx-auto mt-5 p-4" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <Card.Title>Upload Your ID</Card.Title>
        <p className="text-muted">
          Please upload a clear image of your face holding your ID.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit(handleImageSubmit)}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>ID Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              {...register("id_image")}
            />
            {errors.id_image && (
              <Alert variant="danger" className="mt-2">
                {errors.id_image.message as string}
              </Alert>
            )}
          </Form.Group>

          {preview && (
            <div className="text-center mb-3">
              <p>Image Preview:</p>
              <Image
                src={preview}
                alt="ID Preview"
                thumbnail
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
              disabled={loading === "pending"}
            >
              Back
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={loading === "pending" || !imageFile || imageFile.length === 0}
            >
              {loading === "pending" ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Uploading...
                </>
              ) : (
                "Upload ID"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UploadId;