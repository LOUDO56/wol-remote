
let link;
if(window.location.href.includes("192.168.1.41") || window.location.href.includes("localhost"))
    link = "http://192.168.1.41:4001/";
else
    link = "https://fannywiicollec.ddns.net/wakeonlan-";

async function getToken(){
    const res = await fetch(link + 'getToken', {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
      }
    });
    const result = await res.json();
    return result.token
}


async function checkConnection() {
    const connected = await getToken();
    if (connected !== undefined) {
        document.querySelector(".connection").remove();  
        document.querySelector(".main").style.display = "block";
    } else {
        document.querySelector(".main").remove();
        document.querySelector(".connection").style.display = "block";
        document.querySelector(".connection").innerHTML = "<p>Connecte toi:</p><form action=\"" + link + "login\" method=\"post\" class=\"form\"> <label for=\"passwd\"><input class=\"passwd\" placeholder=\"Mot de passe\"type=\"password\" name=\"passwd\" id=\"passwd\" class=\"password\"></label><input type=\"submit\" class=\"submit\" value=\"Se connecter\"></form>"
    }
}

checkConnection();

async function makeActions(type){
    const connected = await getToken();
    let link2 = link;
    let result;
    
    if(link == "http://192.168.1.41:4001/") 
        if(type !== "wakeup")
            link2 = "http://192.168.1.10:4001/";
    try {
        const res = await fetch(link2 + type, {
            headers: {
                "authorization" : "Barer " + connected
            }
        });
        result = await res.json();
        result = result.result
    } catch (error) {
        if(type === "wakeup") result = "Une erreur est survenue l'or du démarrage: " + error;
        else if(type === "shutdown") result = "Le pc n'est pas allumé ou n'a pas encore eu le temps de démarrer le script.";
        else if(type === "hibernate") result = "Le pc n'est pas allumé.";
    }
    document.querySelector(".res").textContent = result;

}

document.querySelector(".power-up").addEventListener("click", () => makeActions("wakeup"));
document.querySelector(".shutdown").addEventListener("click", () => makeActions("shutdown"));
document.querySelector(".hibernate").addEventListener("click", () => makeActions("hibernate"));