window.addEventListener("load", function () {
    var a = document.querySelector("article.page__post");
    new Pack(a).base("js-ease-out-leave-active").base("js-ease-out-leave").transfrom("js-ease-out-enter-active").end(function () {
        ["js-ease-out-enter", "js-ease-out-enter-active", "js-ease-out-leave", "js-ease-out-leave-active"].forEach(function (e) {
            a.classList.remove(e)
        })
    }).toggle()
});