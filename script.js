document.addEventListener("DOMContentLoaded", (event) => {
    var cursor = document.querySelector(".blob");
    var btns = document.getElementsByClassName("group");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
    document.addEventListener("mousemove", function (e) {
        var w = window.innerWidth;
        //change! very bad performace!
        if (!(w <= 1000)) {
            cursor.style.display = "flex";
        } else {
            cursor.style.display = "none";
        }
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });
});
