/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Badge } from "antd";
import Resizer from "react-image-file-resizer";
import UploadImagesApi from "../../services/uploadImages";

interface FileUploadProps {
  values: any;
  setValues: any;
  setLoading: any;
}

const FileUpload = ({ values, setValues, setLoading }: FileUploadProps) => {
  const fileUploadAndResize = (e: any) => {
    // console.log(e.target.files);
    // resize
    const files = e.target.files; // 3
    const allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            UploadImagesApi.uploadImages({ image: uri })
              .then((res) => {
                console.log("IMAGE UPLOAD RES DATA", res);
                setLoading(false);
                allUploadedFiles.push(res.data);

                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD ERR", err);
              });
          },
          "base64"
        );
      }
    }
    // send back to server to upload to cloudinary
    // set url to images[] in the parent component state - ProductCreate
  };

  const handleImageRemove = (public_id: string) => {
    setLoading(true);
    // console.log("remove image", public_id);
    UploadImagesApi.removeImage(public_id)
      .then(() => {
        setLoading(false);
        const { images } = values;
        const filteredImages = images.filter((item: any) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image: any , index: number) => (
            <Badge
              count={
                <div onClick={(): void => handleImageRemove(image.public_id)}>
                  x
                </div>
              }
              key={image.public_id}
              style={{ cursor: "pointer" }}

            
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
                style={{ marginLeft: "8px" }}
                key={index}
              />
            </Badge>
          ))}
      </div>
      <div className="row" style={{ marginBottom: "16px" }}>
        <div>
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </div>
      </div>
    </>
  );
};

export default FileUpload;
