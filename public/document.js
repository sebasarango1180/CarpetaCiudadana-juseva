const fileUploader = document.getElementById("fileElem");

fileUploader.addEventListener('change', (event) => {
    uploadFile(event);
});

const uploadFile = async (e) => {
    let file = e.target.files[0];
    //read data from the blob objects(file)
    let reader = new FileReader();
    //reads the binary data and encodes it as base64 data url
    reader.readAsDataURL(file);
    //reads it finish with either success or failure
    reader.onloadend = () => {
        //reader.result is the result of the reading in base64 string
        const fileName = document.getElementById("inputFile").value;
        const fileType = file.type;
        const selectedFile = reader.result;
        const userId = document.getElementById("inputId").value;
        console.log("Archivo cargado completamente");
        
        sendDocumentData(fileName, selectedFile, Number(userId), fileType)
        };

    };

const sendDocumentData = async (fileName, selectedFile, userId, fileType) => {
    try {
      if (!selectedFile) {
        return
      }
      const response = await fetch("https://us-central1-carpetaciudadana-juseva.cloudfunctions.net/uploadDocument", {
        method: "POST",
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
        body: JSON.stringify({
            document: selectedFile,
            fileName: fileName,
            userId: userId,
            fileType: fileType
        })
      })

      const parsedResponse = await response.json()
      if (parsedResponse.msg === 'SUCCESS') {
        console.log(parsedResponse.msg)
      } else {
        console.log(parsedResponse.error)
      }
      document.getElementById("registerForm").append(parsedResponse.message);
      document.getElementById("inputFile").value = '';
      document.getElementById("inputId").value = '';

    } catch (err) {
      console.log("Error from firebase is: ", err);
    }
}