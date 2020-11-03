const fileUploader = document.getElementById("submitRegistro");

fileUploader.addEventListener('click', (event) => {
    registerCitizen(event);
});

const registerCitizen = async (event) => {

    const payload = {
        id: Number(document.getElementById("inputId").value),
        name: document.getElementById("inputName").value,
        email: document.getElementById("inputEmail").value,
        operatorId: Number(document.getElementById("inputOperatorId").value),
        operatorName: document.getElementById("inputOperatorName").value,
        address: document.getElementById("inputAddress").value
    }
    
    const response = await fetch("https://us-central1-carpetaciudadana-juseva.cloudfunctions.net/registerCitizen", {
        method: "POST",
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
        body: JSON.stringify(payload)
    })

    const parsedResponse = await response.json()
    console.log("Response: ", parsedResponse);

      if (parsedResponse.msg === 'SUCCESS') {
        console.log(parsedResponse.msg)
      }
      else {
        console.log(parsedResponse.error);
      }
      document.getElementById("registerForm").append(parsedResponse.message);

}