import { useState, useEffect } from 'react';
import { Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { ImageFormType, imageSchema } from '@validations/imageSchema';
import ActUploadId from '@store/Auth/Act/ActUploadId';
import { resetUI } from '@store/Auth/AuthSlice';

type StepStatus = 'pending' | 'completed' | 'skipped';
interface IImageWithIDProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setStepStatus: (status: StepStatus) => void;
}

const ImageWithID = ({ setCurrentStep, setStepStatus }: IImageWithIDProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.Authslice);
  const userId = useAppSelector(state => state.Authslice.user?.id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ImageFormType>({
    resolver: zodResolver(imageSchema),
  });

  const imageFile = watch('id_image');


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
    dispatch(resetUI());
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]); 

 
  const handleImageSubmit = (data: ImageFormType) => {

    if (!userId) {
      console.error("User ID is not available. Cannot upload image.");
      return;
    }

  
    const formData = new FormData();

    formData.append('id_image', data.id_image[0]);
    formData.append('user_id', String(userId));

    dispatch(ActUploadId(formData))
      .unwrap()
      .then(() => {
        console.log("Image uploaded successfully!");
        setStepStatus('completed');
        setCurrentStep((prev) => prev + 1);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  };

  return (
    <Form onSubmit={handleSubmit(handleImageSubmit)}>
      <h4 className="mb-3">Upload Your ID</h4>
      <p className="text-muted">
        Please upload a clear image of your face with Your ID.
      </p>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>ID Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          {...register('id_image')}
        />
      </Form.Group>

      {errors.id_image && (
        <Alert variant="danger">{errors.id_image.message as string}</Alert>
      )}

      {preview && (
        <div className="text-center mt-3">
          <p>Image Preview:</p>
          <Image
            src={preview}
            alt="ID Preview"
            thumbnail
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        </div>
      )}

      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loading === 'pending' || !imageFile || imageFile.length === 0}
        >
          {loading === 'pending' ? (
            <>
              <Spinner as="span" animation="border" size="sm" />
              <span> Uploading...</span>
            </>
          ) : (
            'Finish Registration'
          )}
        </Button>
      </div>

      {error && (
        <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
      )}
    </Form>
  );
};

export default ImageWithID;