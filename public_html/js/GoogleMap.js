$(document).ready(function () {
  /* Google Map */
  function mapInitialize() {
var mapStyle =  [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#f7d991"},{"visibility":"on"}]}];

    var yourLatitude = 55.7480685;// 55.748364;
    var yourLongitude = 37.5386824; //37.540079;
    var myOptions = {
      zoom: 15,
      center: new google.maps.LatLng(yourLatitude,yourLongitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      panControl: false,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      scrollwheel: false,
      styles: mapStyle
    };
    var map = new google.maps.Map(document.getElementById('google-map'), myOptions);


    var image = new google.maps.MarkerImage('img/map-location.png');

    var title = 'г.Москва, м. Беговая, Хорошёвское шоссе 13Ак2';
    var myLatLng = new google.maps.LatLng(yourLatitude,yourLongitude);
    
    
    var myLocation = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image,
      title: title
    });
  }
  google.maps.event.addDomListener(window, 'load', mapInitialize);
});