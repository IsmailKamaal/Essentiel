(function($) {
    "use strict"; // Mode strict pour éviter certains comportements problématiques de JavaScript

    // Quand le document est complètement chargé
    $(document).ready(function(){
        var date = new Date(); // Crée une nouvelle date pour l'affichage actuel
        var today = date.getDate(); // Récupère le jour du mois actuel
        // Associe les événements de clic aux éléments DOM
        $(".right-button").click({date: date}, next_year); // Clique sur le bouton pour aller à l'année suivante
        $(".left-button").click({date: date}, prev_year); // Clique sur le bouton pour revenir à l'année précédente
        $(".month").click({date: date}, month_click); // Clique sur un mois pour le sélectionner
        $("#add-button").click({date: date}, new_event); // Clique sur le bouton pour ajouter un événement
        // Définit le mois courant comme actif en ajoutant la classe 'active-month'
        $(".months-row").children().eq(date.getMonth()).addClass("active-month");
        init_calendar(date); // Initialise le calendrier avec la date actuelle
        var events = check_events(today, date.getMonth()+1, date.getFullYear()); // Vérifie les événements pour la date actuelle
        show_events(events, months[date.getMonth()], today); // Affiche les événements pour aujourd'hui
    });

    // Initialise le calendrier en affichant les dates du mois courant
    function init_calendar(date) {
        $(".tbody").empty(); // Vide le contenu actuel de la table de dates
        $(".events-container").empty(); // Vide la section des événements
        var calendar_days = $(".tbody"); // Sélectionne la section du tableau contenant les jours
        var month = date.getMonth(); // Récupère le mois actuel
        var year = date.getFullYear(); // Récupère l'année actuelle
        var day_count = days_in_month(month, year); // Calcule le nombre de jours dans ce mois
        var row = $("<tr class='table-row'></tr>"); // Crée une nouvelle ligne pour les jours
        var today = date.getDate(); // Récupère le jour du mois actuel
        date.setDate(1); // Définit le jour au 1er du mois pour déterminer le premier jour de la semaine
        var first_day = date.getDay(); // Récupère le jour de la semaine du 1er du mois
        // Boucle pour ajouter les jours du mois au tableau
        for(var i=0; i<35+first_day; i++) { // Le calendrier peut avoir jusqu'à 35 cellules pour les jours
            var day = i-first_day+1; // Calcule le jour de chaque cellule
            if(i%7===0) { // Si c'est un dimanche, crée une nouvelle ligne
                calendar_days.append(row);
                row = $("<tr class='table-row'></tr>");
            }
            if(i < first_day || day > day_count) { // Si ce n'est pas un jour du mois, crée une cellule vide
                var curr_date = $("<td class='table-date nil'>"+"</td>");
                row.append(curr_date); // Ajoute la cellule vide à la ligne
            } else { // Si c'est un jour du mois
                var curr_date = $("<td class='table-date'>"+day+"</td>");
                var events = check_events(day, month+1, year); // Récupère les événements pour ce jour
                if(today===day && $(".active-date").length===0) { // Si c'est le jour actuel, le marque comme actif
                    curr_date.addClass("active-date");
                    show_events(events, months[month], day); // Affiche les événements pour ce jour
                }
                if(events.length!==0) { // Si ce jour a des événements, marque-le avec la classe 'event-date'
                    curr_date.addClass("event-date");
                }
                curr_date.click({events: events, month: months[month], day:day}, date_click); // Ajoute un événement de clic à la date
                row.append(curr_date); // Ajoute la cellule à la ligne
            }
        }
        calendar_days.append(row); // Ajoute la dernière ligne au tableau
        $(".year").text(year); // Affiche l'année actuelle dans l'interface
    }

    // Fonction pour obtenir le nombre de jours dans un mois donné
    function days_in_month(month, year) {
        var monthStart = new Date(year, month, 1); // 1er jour du mois
        var monthEnd = new Date(year, month + 1, 1); // 1er jour du mois suivant
        return (monthEnd - monthStart) / (1000 * 60 * 60 * 24); // Calcule le nombre de jours en divisant la différence de dates
    }

    // Gestionnaire d'événements pour lorsqu'une date est cliquée
    function date_click(event) {
        $(".events-container").show(250); // Affiche la section des événements
        $("#dialog").hide(250); // Cache la boîte de dialogue
        $(".active-date").removeClass("active-date"); // Enlève la classe 'active-date' de la date précédente
        $(this).addClass("active-date"); // Ajoute la classe 'active-date' à la date cliquée
        show_events(event.data.events, event.data.month, event.data.day); // Affiche les événements pour cette date
    }

    // Gestionnaire d'événements pour lorsqu'un mois est cliqué
    function month_click(event) {
        $(".events-container").show(250); // Affiche la section des événements
        $("#dialog").hide(250); // Cache la boîte de dialogue
        var date = event.data.date;
        $(".active-month").removeClass("active-month"); // Enlève la classe 'active-month' du mois précédent
        $(this).addClass("active-month"); // Ajoute la classe 'active-month' au mois cliqué
        var new_month = $(".month").index(this); // Récupère l'index du mois cliqué
        date.setMonth(new_month); // Change le mois de la date courante
        init_calendar(date); // Réinitialise le calendrier avec le nouveau mois
    }

    // Gestionnaire d'événements pour lorsqu'on clique sur le bouton de l'année suivante
    function next_year(event) {
        $("#dialog").hide(250); // Cache la boîte de dialogue
        var date = event.data.date;
        var new_year = date.getFullYear()+1; // Incrémente l'année
        $("year").html(new_year); // Affiche la nouvelle année
        date.setFullYear(new_year); // Change l'année de la date
        init_calendar(date); // Réinitialise le calendrier avec la nouvelle année
    }

    // Gestionnaire d'événements pour lorsqu'on clique sur le bouton de l'année précédente
    function prev_year(event) {
        $("#dialog").hide(250); // Cache la boîte de dialogue
        var date = event.data.date;
        var new_year = date.getFullYear()-1; // Décrémente l'année
        $("year").html(new_year); // Affiche la nouvelle année
        date.setFullYear(new_year); // Change l'année de la date
        init_calendar(date); // Réinitialise le calendrier avec la nouvelle année
    }

    // Gestionnaire d'événements pour l'ajout d'un nouvel événement
    function new_event(event) {
        // Si aucune date n'est sélectionnée, ne fait rien
        if($(".active-date").length===0)
            return;
        // Supprime les erreurs de saisie lorsque l'utilisateur clique sur un champ de texte
        $("input").click(function(){
            $(this).removeClass("error-input");
        });
        // Vide les champs du formulaire et cache la section des événements
        $("#dialog input[type=text]").val('');
        $("#dialog input[type=number]").val('');
        $(".events-container").hide(250);
        $("#dialog").show(250); // Affiche la boîte de dialogue pour ajouter un événement
        // Gestionnaire pour le bouton "annuler"
        $("#cancel-button").click(function() {
            $("#name").removeClass("error-input"); // Enlève la classe d'erreur sur le champ 'name'
            $("#count").removeClass("error-input"); // Enlève la classe d'erreur sur le champ 'count'
            $("#dialog").hide(250); // Cache la boîte de dialogue
            $(".events-container").show(250); // Affiche la section des événements
        });
        // Gestionnaire pour le bouton "ok" (ajouter l'événement)
        $("#ok-button").unbind().click({date: event.data.date}, function() {
            var date = event.data.date;
            var name = $("#name").val().trim(); // Récupère le nom de l'événement
            var count = parseInt($("#count").val().trim()); // Récupère le nombre d'invités
            var day = parseInt($(".active-date").html()); // Récupère le jour sélectionné
            // Validation du formulaire
            if(name.length === 0) {
                $("#name").addClass("error-input"); // Ajoute une erreur sur le champ 'name'
            }
            else if(isNaN(count)) {
                $("#count").addClass("error-input"); // Ajoute une erreur sur le champ 'count'
            }
            else {
                $("#dialog").hide(250); // Cache la boîte de dialogue
                new_event_json(name, count, date, day); // Ajoute le nouvel événement
                date.setDate(day); // Remet la date sélectionnée
                init_calendar(date); // Réinitialise le calendrier avec le nouvel événement
            }
        });
    }

    // Ajoute un événement au tableau d'événements
    function new_event_json(name, count, date, day) {
        var event = {
            "occasion": name, // Nom de l'événement
            "invited_count": count, // Nombre d'invités
            "year": date.getFullYear(), // Année de l'événement
            "month": date.getMonth()+1, // Mois de l'événement (1-indexé)
            "day": day // Jour de l'événement
        };
        event_data["events"].push(event); // Ajoute l'événement à la liste d'événements
    }

    // Affiche les événements pour une date donnée
    function show_events(events, month, day) {
        $(".events-container").empty(); // Vide la section des événements
        $(".events-container").show(250); // Affiche la section des événements
        // Si aucun événement n'est prévu pour ce jour
        if(events.length===0) {
            var event_card = $("<div class='event-card'></div>");
            var event_name = $("<div class='event-name'>There are no events planned for "+month+" "+day+".</div>");
            $(event_card).css({ "border-left": "10px solid #FF1744" });
            $(event_card).append(event_name);
            $(".events-container").append(event_card);
        }
        else {
            for(var i=0; i<events.length; i++) { // Pour chaque événement, affiche-le
                var event_card = $("<div class='event-card'></div>");
                var event_name = $("<div class='event-name'>"+events[i]["occasion"]+":</div>");
                var event_count = $("<div class='event-count'>"+events[i]["invited_count"]+" Invited</div>");
                if(events[i]["cancelled"]===true) { // Si l'événement est annulé
                    $(event_card).css({
                        "border-left": "10px solid #FF1744"
                    });
                    event_count = $("<div class='event-cancelled'>Cancelled</div>");
                }
                $(event_card).append(event_name).append(event_count);
                $(".events-container").append(event_card);
            }
        }
    }

    // Vérifie s'il y a des événements pour une date donnée
    function check_events(day, month, year) {
        var events = [];
        for(var i=0; i<event_data["events"].length; i++) {
            var event = event_data["events"][i];
            // Si l'événement correspond à la date donnée, l'ajoute à la liste
            if(event["day"]===day && event["month"]===month && event["year"]===year) {
                events.push(event);
            }
        }
        return events; // Retourne la liste des événements pour cette date
    }

    // Données d'exemple pour les événements
    var event_data = {
        "events": [
            {
                "occasion": "Art et Culture : Inspirer les Enfants",
                "invited_count": 50,
                "year": 2025,
                "month": 1,
                "day": 7,
                "cancelled": false
            },
            {
                "occasion": "Eau Potable : Une Ressource Vitale",
                "invited_count": 30,
                "year": 2025,
                "month": 1,
                "day": 10,
                "cancelled": false
            }
        ]
    };

    // Liste des mois
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
})(jQuery);
