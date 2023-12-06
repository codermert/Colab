// ==UserScript==
// @name         Reklam Engelleme Kaldırıcı
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Reklam Engelleme Kaldırıcı
// @author       codermert
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/codermert/Colab/raw/main/user.js
// @downloadURL  https://github.com/codermert/Colab/raw/main/user.js
// @grant        none
// ==/UserScript==

(function() {
    //
    //      Ayarlar
    //

    // Algılanamayan reklam engelleyiciyi etkinleştir
    const reklamEngelleyici = true;

    // Açılır pencere kaldırıcıyı etkinleştir
    const acilirPencereKaldir = true;

    // Konsola hata ayıklama mesajlarını etkinleştir
    const hataAyiklama = true;

    //
    //      KOD
    //

    // Kaldırılacak alanları ve JSON yollarını belirt
    const kaldirmakIcinAlanlar = [
        '*.youtube-nocookie.com/*'
    ];
    const kaldirmakIcinJsonYollar = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    // Gözlemci yapılandırması
    const gozlemciYapilandirmasi = {
        childList: true,
        subtree: true
    };

    const klavyeOlayi = new KeyboardEvent("keydown", {
        key: "k",
        code: "KeyK",
        keyCode: 75,
        which: 75,
        bubbles: true,
        cancelable: true,
        view: window
    });

    let fareOlayi = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    // Bu, videonun zaten devre dışı bırakıldığını kontrol etmek için kullanılır
    let reklamsizOynatildi = 0;

    if (hataAyiklama) console.log("Reklam Engelleme Kaldırıcı: Betik başlatıldı");
    
    window.__ytplayer_adblockDetected = false;

    if (reklamEngelleyici) reklamEngelleyiciEkle();
    if (acilirPencereKaldir) acilirPencereKaldirci();
    if (acilirPencereKaldir) gozlemci.observe(document.body, gozlemciYapilandirmasi);

    // Açılır pencereleri kaldır
    function acilirPencereKaldirci() {
        kaldirmakIcinJsonYollariniKaldir(kaldirmakIcinAlanlar, kaldirmakIcinJsonYollar);
        setInterval(() => {

            const tamEkranDugmesi = document.querySelector(".ytp-fullscreen-button");
            const modalArkaPlan = document.querySelector("tp-yt-iron-overlay-backdrop");
            const acilirPencere = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const acilirPencereDugmesi = document.getElementById("dismiss-button");

            const video1 = document.querySelector("#movie_player > video.html5-main-video");
            const video2 = document.querySelector("#movie_player > .html5-video-container > video");

            const bodyStili = document.body.style;

            bodyStili.setProperty('overflow-y', 'auto', 'important');

            if (modalArkaPlan) {
                modalArkaPlan.removeAttribute("opened");
                modalArkaPlan.remove();
            }

            if (acilirPencere) {
                if (hataAyiklama) console.log("Reklam Engelleme Kaldırıcı: Açılır pencere algılandı, kaldırılıyor...");

                if (acilirPencereDugmesi) acilirPencereDugmesi.click();
                acilirPencere.remove();
                reklamsizOynatildi = 2;

                tamEkranDugmesi.dispatchEvent(fareOlayi);

                setTimeout(() => {
                    tamEkranDugmesi.dispatchEvent(fareOlayi);
                }, 500);

                if (hataAyiklama) console.log("Reklam Engelleme Kaldırıcı: Açılır pencere kaldırıldı");
            }

            // Açılır pencereyi kaldırdıktan sonra video duraklamış mı diye kontrol et
            if (!reklamsizOynatildi > 0) return;

            // Videonun Duraklatılmasını Kaldır
            videoDuraklatmaKaldir(video1);
            videoDuraklatmaKaldir(video2);

        }, 1000);
    }

    // Algılanamayan reklam engelleyici yöntemi
    function reklamEngelleyiciEkle() {
        setInterval(() => {
            const atlamaDugmesi = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
            const reklam = [...document.querySelectorAll('.ad-showing')][0];
            const yanReklam = document.querySelector('ytd-action-companion-ad-renderer');
            const ekranReklam = document.querySelector('div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint');
            const isiltiKutusu = document.querySelector('div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer');
            const anaKutu = document.querySelector('div#main-container.style-scope.ytd-promoted-video-renderer');
            const beslemeReklam = document.querySelector('ytd-in-feed-ad-layout-renderer');
            const mastheadReklam = document.querySelector('.ytd-video-masthead-ad-v3-renderer');
            const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");
            const videoDisi = document.querySelector(".ytp-ad-skip-button-modern");

            if (reklam) {
                const video = document.querySelector('video');
                video.playbackRate = 10;
                video.volume = 0;
                video.currentTime = video.duration;
                atlamaDugmesi?.click();
            }

            yanReklam?.remove();
            ekranReklam?.remove();
            isiltiKutusu?.remove();
            anaKutu?.remove();
            beslemeReklam?.remove();
            mastheadReklam?.remove();
            sponsor?.forEach((element) => {
                if (element.getAttribute("id") === "panels") {
                    element.childNodes?.forEach((childElement) => {
                        if (childElement.data.targetId && childElement.data.targetId !== "engagement-panel-macro-markers-description-chapters")
                            // Bölümleri atlamak için
                            childElement.remove();
                    });
                } else {
                    element.remove();
                }
            });
            videoDisi?.click();
        }, 50)
    }

    // Videoyu Duraklatmanın Kaldırılması - Çoğu zaman çalışır
    function videoDuraklatmaKaldir(video) {
        if (!video) return;
        if (video.paused) {
            // Videonun duraklatılmasını kaldırmak için "k" tuşuna basıldıymış gibi simulasyon yap
            document.dispatchEvent(klavyeOlayi);
            reklamsizOynatildi = 0;
            if (hataAyiklama) console.log("Reklam Engelleme Kaldırıcı: Video 'k' tuşu kullanılarak duraklatıldı");
        } else if (reklamsizOynatildi > 0) reklamsizOynatildi--;
    }

    function kaldirmakIcinJsonYollariniKaldir(alanlar, jsonYollar) {
        const mevcutAlan = window.location.hostname;
        if (!alanlar.includes(mevcutAlan)) return;

        jsonYollar.forEach(jsonYol => {
            const yolParcalari = jsonYol.split('.');
            let obj = window;
            let oncekiObj = null;
            let undefinedYapilacakParca = null;

            for (const parca of yolParcalari) {
                if (obj.hasOwnProperty(parca)) {
                    oncekiObj = obj; // Ebeveyn nesneyi takip et.
                    undefinedYapilacakParca = parca; // undefined yapabileceğimiz parçayı güncelle.
                    obj = obj[parca];
                } else {
                    break; // Var olmayan bir parça bulduğumuzda dur.
                }
            }

            // Undefined yapabileceğimiz geçerli bir parça belirlediysek, bunu yapın.
            if (oncekiObj && undefinedYapilacakParca !== null) {
                oncekiObj[undefinedYapilacakParca] = undefined;
            }
        });
    }

    // Yeni içerik dinamik olarak yüklendiğinde reklamları gözlemle ve kaldır
    const gozlemci = new MutationObserver(() => {
        kaldirmakIcinJsonYollariniKaldir(kaldirmakIcinAlanlar, kaldirmakIcinJsonYollar);
    });
})();
