import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { Controller, useFormContext } from 'react-hook-form';
import { ICONS } from 'src/layouts/dashboard/nav/config';
// import BorderColorIcon from "@mui/icons-material/BorderColor";

interface RHFSignatureProps {
  name: string;
  label?: string;
  editable?: boolean;
}

const SignaturePreview: React.FC<{
  fileOrUrl: File | string;
}> = ({ fileOrUrl }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof fileOrUrl === 'string') {
      setPreviewUrl(fileOrUrl);
    } else {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(fileOrUrl);
    }
  }, [fileOrUrl]);

  if (!previewUrl) return null;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <img src={previewUrl} alt="Chữ ký" style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
    </Box>
  );
};

const RHFSignature: React.FC<RHFSignatureProps> = ({ name, label, editable = true }) => {
  const { control, setValue, watch } = useFormContext();
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const value = watch(name);

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = async () => {
    const canvas = signatureRef.current;
    if (!canvas || canvas.isEmpty()) return;

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    setValue(name, file, { shouldValidate: true });
    setIsEditing(false);
    setOpen(false);
  };

  const renderValueName = () => {
    if (value instanceof File) return value.name;
    if (typeof value === 'string') return value.split('/').pop();
    return '';
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
            <TextField
              label={label || 'Chữ ký'}
              value={renderValueName()}
              fullWidth
              disabled
              error={!!error}
              helperText={error?.message}
            />
            {editable && (
              <Button sx={{ fontSize: '10px' }} onClick={() => setOpen(true)}>
                chỉnh sửa
              </Button>
            )}
          </Box>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Chữ ký</DialogTitle>
            <DialogContent>
              {/* Nếu đã có dữ liệu chữ ký và chưa bấm chỉnh sửa */}
              {value && !isEditing ? (
                <>
                  <SignaturePreview fileOrUrl={value} />
                  {editable && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Button variant="outlined" onClick={() => setIsEditing(true)}>
                        Chỉnh sửa
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                      width: 500,
                      height: 200,
                      style: { border: '1px solid #ccc', width: '100%' },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button onClick={handleClear}>Xóa</Button>
                    <Button variant="contained" onClick={handleSave}>
                      Lưu
                    </Button>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Đóng</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    />
  );
};

export default RHFSignature;
