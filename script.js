document.addEventListener("DOMContentLoaded", (event) => {
    var cursor = document.querySelector(".blob");
    document.addEventListener("mousemove", function (e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.display = "flex";
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });
});
