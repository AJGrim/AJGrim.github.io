document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const button = document.getElementById('secretButton');

    button.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 3) {
            // Load the Asteroids game script after 3 clicks
            loadGameScript();
			clickCount = 0;
        }
    });

    function loadGameScript() {
		var canvas = document.createElement('canvas');
		canvas.id = 'gameCanvas';
		canvas.width = 800; // Example width
		canvas.height = 600; // Example height
		canvas.style.visibility = 'visible';
		canvas.style.opacity = '1';
		document.body.appendChild(canvas);
		
        const script = document.createElement('script');
        script.src = 'assets/js/asteroids.js';
        document.body.appendChild(script);
    }
});
