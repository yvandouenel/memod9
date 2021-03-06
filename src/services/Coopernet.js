class Coopernet {
    constructor() {
        this.state = {};
        //this.url_server = "http://local.d8-json.my/";
        this.url_server = "https://www.coopernet.fr/";
        //this.url_server = "http://local.coopernet.my/";
        //this.url_server = "http://dev.coopernet.fr/";
        this.token = "";
        this.user = {
            uid: 0,
            uname: "",
            upwd: ""
        };
    }
    removeCard = (num_card, login, pwd, callbackSuccess, callbackFailed) => {
        console.log("dans removeCard - carte " + num_card);
        // utilisation de fetch
        fetch(this.url_server + "node/" + num_card + "?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "DELETE",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                Authorization: "Basic " + btoa(login + ":" + pwd) // btoa = encodage en base 64
            },
            body: JSON.stringify({
                _links: {
                    type: {
                        href: this.url_server + "rest/type/node/carte"
                    }
                },

                type: [
                    {
                        target_id: "carte"
                    }
                ]
            })
        })
            .then(response => response)
            .then(data => {
                console.log("data reçues:", data);
                if (data.status === 204) {
                    callbackSuccess();
                } else {
                    callbackFailed();
                    throw new Error("Le status du serveur n'est pas 204", data.status);
                }
            })
            .catch(error => {
                console.error("Erreur attrapée dans removeCard :", error);
            });
    };
    removeTerm = (tid, login, pwd, callbackSuccess, callbackFailed) => {
        console.log("dans removeTerm - term " + tid);
        // utilisation de fetch
        fetch(this.url_server + "taxonomy/term/" + tid + "?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "DELETE",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                Authorization: "Basic " + btoa(login + ":" + pwd) // btoa = encodage en base 64
            }
        })
            .then(response => response)
            .then(data => {
                console.log("data reçues dans removeTerm:", data);
                if (data.status === 204) {
                    callbackSuccess();
                } else {
                    callbackFailed();
                    throw new Error("Le status du serveur n'est pas 204", data.status);
                }
            })
            .catch(error => {
                console.error("Erreur attrapée dans removeTerm :", error);
            });
    };
    /**
     * Méthode qui permet à une carte de changer de colonne
     */
    createReqEditColumnCard = (
        num_card,
        login,
        pwd,
        new_col_id,
        themeid,
        callbackSuccess,
        callbackFailed
    ) => {
        console.log("Dans createReqEditColumnCard de coopernet");
        console.log("token : ", this.token);
        // création de la requête
        // utilisation de fetch

        fetch(this.url_server + "node/" + num_card + "?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "PATCH",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                "Authorization": "Basic " + btoa(login + ":" + pwd) // btoa = encodage en base 64
            },
            body: JSON.stringify({
                _links: {
                    type: {
                        href: this.url_server + "rest/type/node/carte"
                    }
                },
                field_carte_colonne: [
                    {
                        target_id: new_col_id,
                        url: "/taxonomy/term/" + new_col_id
                    }
                ],

                type: [
                    {
                        target_id: "carte"
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("data reçues dans createReqEditColumnCard :", data);
                if (data) {
                    callbackSuccess(themeid);
                } else {
                    callbackFailed("Erreur de login ou de mot de passe");
                    throw new Error("Problème de data ", data);
                }
            })
            .catch(error => { console.error("Erreur attrapée dans createReqEditColumnCard", error); });
    };
    createReqEditCard = (
        card,
        themeid,
        columnid,
        callbackSuccess,
        callbackFailed,
        no_reload
    ) => {
        console.log("Dans createReqEditCard de coopernet");
        // création de la requête avec fetch
        fetch(this.url_server + "node/" + card.id + "?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "PATCH",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                Authorization: "Basic " + btoa(this.user.uname + ":" + this.user.upwd) // btoa = encodage en base 64
            },
            body: JSON.stringify({
                _links: {
                    type: {
                        href: this.url_server + "rest/type/node/carte"
                    }
                },
                title: [
                    {
                        value: card.question
                    }
                ],
                field_carte_question: [
                    {
                        value: card.question
                    }
                ],
                field_carte_reponse: [
                    {
                        value: card.reponse
                    }
                ],
                field_carte_explication: [
                    {
                        value: card.explication
                    }
                ],
                field_carte_colonne: [
                    {
                        target_id: columnid,
                        url: "/taxonomy/term/" + columnid
                    }
                ],
                field_carte_thematique: [
                    {
                        target_id: themeid,
                        url: "/taxonomy/term/" + themeid
                    }
                ],
                type: [
                    {
                        target_id: "carte"
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("data reçues :", data);
                if (data) {
                    callbackSuccess(themeid, no_reload);
                } else {
                    callbackFailed("Erreur de login ou de mot de passe");
                    throw new Error("Problème de donnée", data);
                }
            })
            .catch(error => {
                console.error("Erreur attrapée dans createReqEditCard :", error);
            });
    };
    createReqAddCards = (
        card,
        themeid,
        callbackSuccess,
        callbackFailed
    ) => {
        console.log("Dans createReqAddCards de coopernet");
        // création de la requête
        // utilisation de fetch
        fetch(this.url_server + "node?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                Authorization: "Basic " + btoa(this.user.uname + ":" + this.user.upwd) // btoa = encodage en base 64
            },
            body: JSON.stringify({
                _links: {
                    type: {
                        href: this.url_server + "rest/type/node/carte"
                    }
                },
                title: [
                    {
                        value: card.question
                    }
                ],
                field_carte_question: [
                    {
                        value: card.question
                    }
                ],
                field_carte_reponse: [
                    {
                        value: card.reponse
                    }
                ],
                field_carte_explication: [
                    {
                        value: card.explication
                    }
                ],
                field_carte_colonne: [
                    {
                        target_id: card.colonne,
                        url: "/taxonomy/term/" + card.colonnne
                    }
                ],
                field_carte_thematique: [
                    {
                        target_id: themeid,
                        url: "/taxonomy/term/" + themeid
                    }
                ],
                type: [
                    {
                        target_id: "carte"
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("data reçues dans createReqAddCards: ", data);
                if (data.hasOwnProperty("created") && data.created[0].value) {
                    callbackSuccess(themeid, card.id);
                } else {
                    callbackFailed("Erreur de login ou de mot de passe");
                    throw new Error("Problème de donnée : ", data);
                }
            })
            .catch(error => { console.error("Erreur catchée dans createReqAddCard : ", error); });
    };
    createReqAddOrEditTerm = (
        login,
        pwd,
        label,
        tid,
        callbackSuccess,
        callbackFailed,
        ptid = 0
    ) => {
        console.log("Dans createReqAddOrEditTerm de coopernet, envoie du label : ", label);
        //console.log("ptid : ", ptid);
        // création de la requête
        // utilisation de fetch
        fetch(this.url_server + "memo/term?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                Authorization: "Basic " + btoa(login + ":" + pwd) // btoa = encodage en base 64
            },
            body: JSON.stringify({
                _links: {
                    type: {
                        href: this.url_server + "memo/term"
                    }
                },
                label: [
                    {
                        value: label
                    }
                ],
                tid: [
                    {
                        value: tid
                    }
                ],
                ptid: [
                    {
                        value: ptid
                    }
                ]
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("data reçues : ", data);
                if (data.hasOwnProperty("newtid")) {
                    callbackSuccess(data.newtid, "added");
                } else if (data.hasOwnProperty("updatedtid")) {
                    callbackSuccess(data.updatedtid, "updated");
                } else {
                    callbackFailed("Erreur de login ou de mot de passe");
                    throw new Error("Problème de donnée", data);
                }
            })
            .catch(error => {
                console.error("Erreur attrapée dans createReqAddOrEditTerm", error);
            });
    };

    /**
     * @param  {number} termNumber
     * @param  {function} callbackSuccess
     * @param  {function} callbackFailed
     * @param  {number} depth=-1 Va permettre de savoir s'il faut ou pas recharger
     * @param  {string} term_name
     * @param  {number} subterm_size
     */
    createReqCards = (
        termNumber,
        callbackSuccess,
        callbackFailed,
        depth = -1,
        term_name = "",
        has_subterm = true,
        uid = this.user.uid
    ) => {
        // création de la requête
        //console.log("Dans createReqCards de coopernet. termNumber : ", termNumber);
        //console.log("token : ", this.token);
        const req_cards = new XMLHttpRequest();
        req_cards.onload = () => {
            // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
            this.getCards(req_cards,
                termNumber,
                callbackSuccess,
                callbackFailed,
                depth,
                term_name,
                has_subterm);
        };
        // Fait appel au "end-point créé dans le module drupal memo"
        // Pour régler le problème de cache, j'ai ajouté le paramètre "time" à la
        // requête get cf : https://drupal.stackexchange.com/questions/222467/drupal-8-caches-rest-api-calls/222482
        req_cards.open(
            "GET",
            this.url_server +
            "memo/list_cartes_term/" +
            uid +
            "/" +
            termNumber +
            "&_format=json&time=" +
            Math.floor(Math.random() * 10000),
            true
        );
        req_cards.setRequestHeader(
            "Authorization",
            "Basic " + btoa(this.user.uname + ":" + this.user.upwd)
        );
        req_cards.send(null);
    };
    /**
     * @param  {XMLHttpRequest} req
     * @param  {number} termNumber
     * @param  {function} callbackSuccess
     * @param  {function} callbackFailed
     * @param  {number} depth
     * @param  {string} term_name
     * @param  {number} subterm_size
     */
    getCards = (req,
        termNumber,
        callbackSuccess,
        callbackFailed,
        depth,
        term_name,
        has_subterm) => {
        //console.log("Dans getCards de coopernet. termNumber : ", termNumber);
        // On teste directement le status de notre instance de XMLHttpRequest
        if (req.status === 200) {
            // Tout baigne, voici le contenu du token
            let jsonResponse = JSON.parse(req.responseText);
            // ajout de la propriété show_reponse à chaque carte

            jsonResponse.forEach(function (element) {
                element.cartes.forEach(function (ele) {
                    ele.show_reponse = false;
                });
            });
            console.log("Récupération des cartes ok pour ", term_name);
            console.log("Ajout prop show_reponse to all cards", jsonResponse);
            callbackSuccess(jsonResponse, termNumber, depth, term_name, has_subterm);
        } else {
            // On y est pas encore, voici le statut actuel
            console.log("Pb getCards - Statut : ", req.status, req.statusText);
        }
    };
    getUsers = (callbackSuccess, callbackFailed) => {
        // création de la requête
        console.log("Dans getUsers de coopernet.");
        return fetch(this.url_server + "memo/users/", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "GET",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                "Authorization": "Basic " + btoa(this.user.uname + ":" + this.user.upwd) // btoa = encodage en base 64
            }
        })
            .then(response => {
                console.log("data reçues dans getUsers avant json() :", response);
                if (response.status === 200) return response.json();
                else throw new Error("Problème de réponse ", response);
            })
            .then(data => {
                console.log("data reçues dans getTerms :", data);
                if (data) {
                    // ajout de la propriété "open" à "false" pour tous les termes de
                    // niveau 1
                    //data.forEach()
                    return data;
                } else {
                    throw new Error("Problème de data ", data);
                }
            })
            .catch(error => { console.error("Erreur attrapée dans getUsers", error); });
    };
    logUser = (login, pwd) => {
        console.log(`Dans logUser ;`, login, pwd, this.token);
        return fetch(this.url_server + "user/login?_format=json", {
            credentials: "same-origin",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-Token": this.token
            },
            body: JSON.stringify({
              name: login,
              pass: pwd
            })
          })
            .then(response => response.json())
            .then(data => {
              //console.log("success", data);
              if (data.current_user === undefined) {
                console.log("Erreur de login");
                throw new Error("Erreur de data : ", data);
              } else {
                //console.log("user", data.current_user);
                this.user.uid = data.current_user.uid;
                this.user.uname = data.current_user.name;
                this.user.upwd = pwd; 
              }
            })
    }
    /**
     * @param  {} callbackSuccess
     * @param  {} callbackFailed
     */
    getTerms = (callbackSuccess, callbackFailed, user = this.user) => {
        // création de la requête
        console.log("Dans getTerms de coopernet. User = ", user);
        fetch(this.url_server + "memo/themes/" +
            user.uid, {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "GET",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token,
                "Authorization": "Basic " + btoa(this.user.uname + ":" + this.user.upwd) // btoa = encodage en base 64
            }
        })
            .then(response => {
                console.log("data reçues dans getTerms avant json() :", response);
                if (response.status === 200) return response.json();
                else throw new Error("Problème de réponse ", response);
            })
            .then(data => {
                console.log("data reçues dans getTerms :", data);
                if (data) {
                    // ajout de la propriété "open" à "false" pour tous les termes de
                    // niveau 1
                    //data.forEach()
                    callbackSuccess(data, user);
                } else {
                    callbackFailed("Erreur de login ou de mot de passe");
                    throw new Error("Problème de data ", data);
                }
            })
            .catch(error => { console.error("Erreur attrapée dans getTerms", error); });
    };


    createReqLogout = () => {
        console.log("Dans createReqLogout de coopernet");
        fetch(this.url_server + "user/logout?_format=hal_json", {
            // permet d'accepter les cookies ?
            credentials: "same-origin",
            method: "GET",
            headers: {
                "Content-Type": "application/hal+json",
                "X-CSRF-Token": this.token
            }
        })
            .then(response => response)
            .then(data => {
                console.log("data reçues :", data);
                if (data) {
                    //callbackSuccess(themeid);
                } else {
                    //callbackFailed("Erreur de login ou de mot de passe");
                }
            })
            .catch(error => { console.error("Erreur attrapée dans createReqLogout", error) });
    };
    getToken = () => {
        console.log(`Dans getToken`);
        return fetch(`${this.url_server}/session/token/`)
            .then((response) => {
                if (response.status !== 200) { // si ça c'est mal passé
                    throw new Error("Le serveur n'a pas répondu correctement");
                } else return response.text(); // renvoie une promesse
            })
            .then((token) => {
                this.token = token;
                return token;
            });
    }

    isLoggedIn = () => {
        console.log("Dans isLoggedIn de Coopernet");

        return fetch(`${this.url_server}/memo/is_logged`)
            .then(function (response) {
                if (response.status !== 200) { // si ça c'est mal passé
                    throw new Error("Le serveur n'a pas répondu correctement");
                } else return response.json(); // renvoie une promesse
            })
            .then(function (user) {
                //this.token = token;
                return user;
            });
    };



    postLogin = req => {
        console.log("dans postLogin de coopernet");
        // On teste directement le status de notre instance de XMLHttpRequest
        if (req.status === 200) {
            // Tout baigne, voici le contenu de la réponse
            console.log("login response : ", req.responseText);
        } else {
            // On y est pas encore, voici le statut actuel
            console.log("Pb login - Statut : ", req.status, req.statusText);
            return "";
        }
    };


    getIsLogged = (req, callbackSuccess, callbackFailed) => {
        console.log('Dans getIsLogged de coopernet');
        // On teste directement le status de notre instance de XMLHttpRequest
        //console.log("dans getIsLogged de Coopernet");
        if (req.status === 200) {
            // Tout baigne, voici le contenu de la réponse
            console.log("Appel à /memo/is_logged ok");
            // Construction de l'objet js à partir des données récupérées avec
            // la fonction JSON.parse
            let jsonResponse = JSON.parse(req.responseText);
            if (jsonResponse.user === 0) {
                console.log("anonymous user");
                //console.log("User", jsonResponse.user);
                callbackFailed();
            } else {
                //console.log("User", jsonResponse.user);
                callbackSuccess();
            }
            //login(this.responseText);
        } else if (req.status === 403) {
            console.log("Statut 403", req.status, req.statusText);
            this.createReqLogout();
        } else {
            // On y est pas encore, voici le statut actuel
            console.log("Statut d'erreur : ", req.status, req.statusText);
            callbackFailed();
        }
    };
}
export default Coopernet;
