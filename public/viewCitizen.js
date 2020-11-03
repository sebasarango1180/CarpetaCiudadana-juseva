const citizenViewer = document.getElementById("submitConsulta");
const codeSpace = document.getElementById("code");

citizenViewer.addEventListener('click', (event) => {
    viewCitizen(event);
});

const viewCitizen = async (event) => {

    const citizenId = document.getElementById("inputId").value;
    const response = await fetch(`https://us-central1-carpetaciudadana-juseva.cloudfunctions.net/getUser?id=${citizenId}`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })

    const parsedResponse = await response.json()
    console.log("Response: ", parsedResponse);

    codeSpace.append(JSON.stringify(parsedResponse.data));
}