const { GoogleCloudStorage }= require('@google-cloud/storage');
  
  const GOOGLE_CLOUD_PROJECT_ID = 'windy-celerity-236018'; // Replace with your project ID
  const GOOGLE_CLOUD_KEYFILE = '../../My_First_Project-6f01f677a385.json'; // Replace with the path to the downloaded private key
  
  const {Storage} = require('@google-cloud/storage');
 // const storage = new Storage({GOOGLE_CLOUD_KEYFILE,GOOGLE_CLOUD_PROJECT_ID});
  //const bucket = storage.bucket('sriegodedios')
  
  
  
  const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });
  
  
  
  /*****
  async function quickstart(
  projectId = GOOGLE_CLOUD_PROJECT_ID, // Your Google Cloud Platform project ID
  keyFilename = GOOGLE_CLOUD_KEYFILE //Full path of the JSON file
) {
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage({keyFilename,projectId});
  const bucket = storage.bucket('sriegodedios')
}*******/
  
  
  
  
  
  /**************/


  exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;
  /**
   * Copy file from local to a GCS bucket.
   * Uploaded file will be made publicly accessible.
   *
   * @param {string} localFilePath
   * @param {string} bucketName
   * @param {Object} [options]
   * @return {Promise.<string>} - The public URL of the uploaded file.
   */
  exports.copyFileToGCS = (localFilePath, bucketName, options) => {
    options = options || {bucket: 'sriegodedios'};
  
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);
  
    return bucket.upload(localFilePath, options)
      .then(() => file.makePublic())
      .then(() => exports.getPublicUrl(bucketName, gcsName));
  };