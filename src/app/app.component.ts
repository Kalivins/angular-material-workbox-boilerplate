import { Component, OnInit } from '@angular/core';

import * as L from '../leaflet';
import 'localforage';
import 'leaflet.offline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'PWA WORKBOX BOILERPLATE';

  ngOnInit() {
    // Init map
    const map = L.map('map').setView([44.771079, 5.742806], 12);
  
    var baseLayer = L.tileLayer.offline('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map'
    }).addTo(map);

    const icon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
    });

    L.marker([45.5667, 5.9333], {icon: icon}).bindPopup("Chambery").addTo(map).openPopup();

    var control = L.control.savetiles(baseLayer, {
      'zoomlevels': [10,16],
      'confirm': function(layer, succescallback) {
        if (window.confirm("Save " + layer._tilesforSave.length)) {
          succescallback();
        }
      },
      'confirmRemoval': function(layer, successCallback) {
        if (window.confirm("Remove all the tiles?")) {
          successCallback();
        }
      },
      'saveText': '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
      'rmText': '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>'
      });
      control.addTo(map);
      document.getElementById("remove_tiles").addEventListener('click',function(e) {
      control._rmTiles();
      });
      baseLayer.on('storagesize', function(e) {
      document.getElementById('storage').innerHTML = e.storagesize;
      })

      var progress;
      baseLayer.on('savestart', function(e) {
      progress = 0;
      document.getElementById("total").innerHTML = e._tilesforSave.length;
      });
      baseLayer.on('savetileend', function(e) {
      progress++;
      document.getElementById('progress').innerHTML = progress;
      });
      baseLayer.on('loadend', function(e) {
      alert("Saved all tiles");
      });
      baseLayer.on('tilesremoved', function(e) {
      alert("Removed all tiles");
      });
  }

}
