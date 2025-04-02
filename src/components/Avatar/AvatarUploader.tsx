import { useState, useRef } from 'react';
import { Avatar, Box, IconButton, Dialog, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from 'src/apis/user.api';
import { useParams } from 'react-router';
import { LoadingButton } from '@mui/lab';

interface UserData {
  name: string;
  avatar?: string;
}

const AvatarUploader = ({ userData }: { userData: UserData }) => {
  const { id } = useParams();
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useMutation({
    mutationFn: (data: FormData) => {
      return updateUser({ id, data: { avatar: data } });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const formData = new FormData();
    formData.append('avatar', fileInputRef.current.files[0]);
    handleUpdate.mutate(formData);
  };

  return (
    <>
      <Box
        position="relative"
        width={100}
        height={100}
        mx="auto"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Avatar
          src={preview || userData?.avatar}
          sx={{ width: 100, height: 100, bgcolor: 'primary.main', cursor: 'pointer' }}
          onClick={() => setOpen(true)}
        >
          {!userData?.avatar && userData?.name[0]}
        </Avatar>

        <IconButton
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>
        </IconButton>

        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {preview && (
          <LoadingButton
            sx={{ textAlign: 'center' }}
            loading={handleUpdate.isPending}
            onClick={handleUpload}
          >
            Cập nhật
          </LoadingButton>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'black',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            cursor: 'pointer',
          }}
          onClick={() => setOpen(false)}
        >
          <img
            src={preview || userData?.avatar}
            alt="Avatar"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default AvatarUploader;
