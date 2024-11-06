import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import initMongoConnection from './db/initMongoConnection.js';

import setupServer from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};
bootstrap();
//

// Перевірка чи працює GLODINARY
import { v2 as cloudinary } from 'cloudinary';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: 'diz9j1akk',
    api_key: '117327821569389',
    api_secret: '1F2XFY7hxIZlj2RIYtEdRfHf27E', // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      },
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url('shoes', {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();
