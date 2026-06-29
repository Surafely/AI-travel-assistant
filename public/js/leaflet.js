/* eslint-disable */

export const displayMap = (mapElement) => {
  const escapeHtml = (value) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const getPopupContent = (location) => {
    const label = location.day ? `Day ${location.day}` : 'Start';
    const description = escapeHtml(location.description || 'Trip stop');

    return `
    <strong>${label}: ${description}</strong>
   
  `;
  };

  if (mapElement && window.L) {
    const mapPanel = mapElement.closest('.trip-map');
    const locations = JSON.parse(mapElement.dataset.locations || '[]');
    const points = locations
      .filter((location) => Array.isArray(location.coordinates))
      .map((location) => ({
        ...location,
        latLng: [location.coordinates[1], location.coordinates[0]],
      }));

    if (points.length) {
      const map = L.map(mapElement, {
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      points.forEach((point) => {
        const markerLabel = point.day || 'S';

        const marker = L.marker(point.latLng, {
          icon: L.divIcon({
            className: 'trip-map__marker',
            html: `<span data-label="${markerLabel}"></span>`,
            iconSize: [34, 42],
            iconAnchor: [17, 42],
            popupAnchor: [0, -34],
          }),
        })
          .addTo(map)
          .bindPopup(getPopupContent(point), {
            closeButton: false,
            className: 'trip-map__popup',
          });

        marker.bindTooltip(getPopupContent(point), {
          permanent: true,
          direction: 'top',
        });
      });

      if (points.length > 1) {
        L.polyline(
          points.map((point) => point.latLng),
          {
            color: '#3dd6c3',
            weight: 5,
            opacity: 0.92,
            lineCap: 'round',
            lineJoin: 'round',
          },
        ).addTo(map);
      }

      map.fitBounds(L.latLngBounds(points.map((point) => point.latLng)), {
        padding: [48, 48],
        maxZoom: 13,
      });

      const resizeMap = () => map.invalidateSize();
      const revealMap = () => {
        if (mapPanel) mapPanel.classList.add('trip-map--ready');
        resizeMap();
      };

      if (mapPanel && 'IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                revealMap();
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.22 },
        );

        mapObserver.observe(mapPanel);
      } else {
        revealMap();
      }

      window.addEventListener('load', resizeMap);
      window.addEventListener('resize', resizeMap);
      setTimeout(resizeMap, 250);
    } else if (mapPanel) {
      mapPanel.classList.add('trip-map--ready');
    }
  }
};
