import styles from './device-image.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { watch } from 'fs';
import { useState } from 'react';


/* eslint-disable-next-line */
export interface DeviceImageProps {}

export function DeviceImage(props: DeviceImageProps) {

  const [image, setImage] = useState<string>('');

  const schema = yup.object().shape({
    files: yup
      .mixed()
      .test('required', 'Please select a file', (value) => value && value.length),
  });

  const convert2base64 = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result?.toString() || '');
    };

    reader.readAsDataURL(file);
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { files?: FileList }) => {
    if (data.files && data.files.length > 0) {
      convert2base64(data.files[0]);
    }
  };

  return (
    <div className={styles['container']}>
      <h1>Welcome to DeviceImage!</h1>
      <div className={styles.fileInputContainer}>
        {image ? <img src={image} alt="Preview" width="450" /> : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* {watch('files') || watch('files')?.length === 0 ? ( */}
            <div>
              <input
                type="file"
                id="fileupload"
                className={styles['fileInput']}
                // style={{ display: 'none' }}
                // {...register('files')}
                // onChange={(e) => {
                //   const files = e.target.files;
                //   if (files && files.length > 0) {
                //     convert2base64(files[0]);
                //   }
                // }}
              />
              <label htmlFor="fileupload" className={styles.fileInputLabel}>
                Select file...
              </label>
            </div>
          {/* ) : ( */}
            {/* <strong>{watch('files') && (watch('files') as FileList)[0].name}</strong> */}
          {/* )} */}
          <button type="submit" className="btn">
            Submit
          </button>
          {errors.files && <div className="error">{errors.files.message}</div>}
        </form>
      </div>
    </div>
  );
}

export default DeviceImage;
