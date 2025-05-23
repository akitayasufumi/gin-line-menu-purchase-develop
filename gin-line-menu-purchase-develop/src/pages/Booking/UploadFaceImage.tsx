import { useAppDispatch } from "@/redux/hook"
import { SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { isImageFile } from "@/utils"
import { Delete, Image } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import React, { useRef } from "react"

const UploadFaceImage = ({
  faceImages,
  setFaceImages,
}: {
  faceImages: Array<{ url: string; base: string }>
  setFaceImages: any
}) => {
  const dispatch = useAppDispatch()
  const uploadImageRef = useRef<HTMLInputElement | null>(null)
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!isImageFile(file)) {
        return dispatch(SET_MESSAGE_ALERT("画像のみアップロードしてください。"))
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        const base64String = reader.result
          ? reader.result.toString().replace("data:", "").replace(/^.+,/, "")
          : ""
        if (reader.result)
          setFaceImages([
            ...faceImages,
            { url: reader.result.toString(), base: base64String },
          ])
      }
    }
  }

  const handleImageDelete = (index: number) => {
    const newImages = [...faceImages]
    newImages.splice(index, 1)
    setFaceImages(newImages)
  }

  return (
    <div className="mt-5">
      <p className="text-[18px] font-bold mb-2">顔写真のアップロード</p>
      <div className="flex flex-wrap">
        {faceImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              width: 110,
              height: 110,
              border: "2px dashed #c4c4c4",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
              marginRight: 1,
              marginBottom: 1,
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <Box
              component="img"
              src={image.url}
              alt="Image"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                position: "relative",
              }}
            />
            <IconButton
              onClick={() => handleImageDelete(index)}
              sx={{
                position: "absolute",
                top: "5px",
                left: "5px",
                backgroundColor: "#ccc",
                "&:hover": {
                  backgroundColor: "#ddd",
                },
              }}
            >
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Box>
        ))}
        {faceImages.length < 5 && (
          <Box
            sx={{
              width: 110,
              height: 110,
              border: "2px dashed #c4c4c4",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
              marginRight: 1,
              marginBottom: 1,
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
            onClick={() => uploadImageRef.current?.click()}
          >
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-image"
              type="file"
              onChange={e => handleImageChange(e)}
              ref={uploadImageRef}
            />
            <Stack
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                component="span"
                size="medium"
                color="primary"
                disableRipple
              >
                <Image fontSize="medium" />
              </IconButton>
              <Typography variant="body2">アップロード</Typography>
            </Stack>
          </Box>
        )}
      </div>
    </div>
  )
}
export default React.memo(UploadFaceImage)
