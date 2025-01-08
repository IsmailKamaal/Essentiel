(function () {
	
	'use strict';

	// Fonction pour détecter les appareils iPad
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	// Fonction pour détecter les appareils iPhone ou iPod
	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Initialisation du menu principal avec le plugin Superfish
	var mainMenu = function() {
		$('#fh5co-primary-menu').superfish({
			delay: 0, // Retard de l'animation
			animation: {
				opacity: 'show' // Animation d'apparition par opacité
			},
			speed: 'fast', // Vitesse de l'animation
			cssArrows: true, // Activation des flèches CSS
			disableHI: true // Désactivation de l'option hoverIntent
		});
	};

	// Initialisation de l'effet parallax (défilement parallaxe)
	var parallax = function() {
		$(window).stellar(); // Applique le plugin Stellar pour le parallaxe
	};

	// Fonction pour gérer le menu off-canvas (menu qui glisse)
	var offcanvas = function() {
		// Duplique le menu principal et modifie l'ID pour en faire un menu off-canvas
		var $clone = $('#fh5co-menu-wrap').clone();
		$clone.attr({
			'id' : 'offcanvas-menu'
		});
		$clone.find('> ul').attr({
			'class' : '',
			'id' : ''
		});

		// Insère le menu cloné dans la page
		$('#fh5co-page').prepend($clone);

		// Gestion du clic sur le bouton de menu burger pour ouvrir/fermer le menu off-canvas
		$('.js-fh5co-nav-toggle').on('click', function(){
			// Ajoute ou retire la classe 'fh5co-offcanvas' sur le body pour ouvrir/fermer le menu
			if ( $('body').hasClass('fh5co-offcanvas') ) {
				$('body').removeClass('fh5co-offcanvas');
			} else {
				$('body').addClass('fh5co-offcanvas');
			}
		});

		// Ajuste la hauteur du menu off-canvas en fonction de la hauteur de la fenêtre
		$('#offcanvas-menu').css('height', $(window).height());

		// Réajuste la hauteur du menu lors du redimensionnement de la fenêtre
		$(window).resize(function(){
			var w = $(window);
			$('#offcanvas-menu').css('height', w.height());

			// Si la largeur de la fenêtre est supérieure à 769px, ferme le menu
			if ( w.width() > 769 ) {
				if ( $('body').hasClass('fh5co-offcanvas') ) {
					$('body').removeClass('fh5co-offcanvas');
				}
			}
		});	
	}

	// Fermeture du menu off-canvas lorsqu'un clic est détecté en dehors du menu
	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
		    var container = $("#offcanvas-menu, .js-fh5co-nav-toggle");
		    // Si le clic est en dehors du menu et du bouton de menu, ferme le menu
		    if (!container.is(e.target) && container.has(e.target).length === 0) {
		      if ( $('body').hasClass('fh5co-offcanvas') ) {
					$('body').removeClass('fh5co-offcanvas');
				}
		    }
		});
	};

	// Fonction pour gérer les animations à l'apparition des éléments
	var contentWayPoint = function() {
		var i = 0;
		// Détecte l'apparition des éléments avec la classe 'animate-box'
		$('.animate-box').waypoint( function( direction ) {
			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				i++;
				$(this.element).addClass('item-animate'); // Ajoute la classe d'animation
				setTimeout(function(){
					// Applique l'animation 'fadeInUp' aux éléments un par un
					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
			}

		} , { offset: '85%' } ); // L'animation se déclenche lorsque l'élément est à 85% de la hauteur de la fenêtre
	};

	// Fonction pour rendre un élément (bannière) sticky (fixe) lors du défilement
	var stickyBanner = function() {
		var $stickyElement = $('.sticky-banner');
		var sticky;
		if ($stickyElement.length) {
		  sticky = new Waypoint.Sticky({
		      element: $stickyElement[0],
		      offset: 0 // L'élément devient sticky dès qu'il atteint le haut de la fenêtre
		  })
		}
	}; 

	// Exécution des fonctions lorsque le document est chargé
	$(function(){
		mainMenu(); // Initialise le menu principal
		parallax(); // Active l'effet parallaxe
		offcanvas(); // Active le menu off-canvas
		mobileMenuOutsideClick(); // Permet de fermer le menu lorsqu'on clique à l'extérieur
		contentWayPoint(); // Active les animations d'apparition des éléments
		stickyBanner(); // Rend la bannière sticky
	});
}());
