// ==UserScript==
// @name         Reklam Engelleyici | codermert
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Reklam Engelleyici | codermert
// @author       codermert
// @match        https://www.youtube.com/*
// @icon         https://telegra.ph/file/085f9bd5981df003fc043.png
// @updateURL    https://github.com/codermert/Colab/raw/main/youtube-remover.user.js
// @downloadURL  https://github.com/codermert/Colab/raw/main/youtube-remover.user.js
// @grant        none
// @license MIT
// ==/UserScript==
(function() {
    `use strict`;

    // Arayüz reklamı seçici
    const cssSelectorArr = [
        `#masthead-ad`, // Ana sayfa üst banner reklamı.
        `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`, // Ana sayfa video düzeni reklamı.
        `.video-ads.ytp-ad-module`, // Oynatıcı alt banner reklamı.
        `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`, // Oynatma sayfası üye promosyon reklamı.
        `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`, // Oynatma sayfası sağ üstte önerilen reklam.
        `#related #player-ads`, // Oynatma sayfası yorumlar sağ tarafındaki tanıtım reklamı.
        `#related ytd-ad-slot-renderer`, // Oynatma sayfası yorumlar sağ tarafındaki video düzeni reklamı.
        `ytd-ad-slot-renderer`, // Arama sayfası reklamı.
        `yt-mealbar-promo-renderer`, // Oynatma sayfası üye öneri reklamı.
        `ad-slot-renderer`, // M Oynatma sayfası üçüncü taraf öneri reklamı.
        `ytm-companion-ad-renderer`, // M Atlanabilir video reklam bağlantı yeri
    ];

    window.dev = false; // Geliştirme modu

    /**
     * Standart tarihi biçimlendirme
     * @param {Date} time Zaman
     * @param {String} format Biçim
     * @return {String}
     */
    function moment(time, format = `YYYY-MM-DD HH:mm:ss`) {
        // Yıl, ay, gün, saat, dakika, saniye al
        let y = time.getFullYear()
        let m = (time.getMonth() + 1).toString().padStart(2, `0`)
        let d = time.getDate().toString().padStart(2, `0`)
        let h = time.getHours().toString().padStart(2, `0`)
        let min = time.getMinutes().toString().padStart(2, `0`)
        let s = time.getSeconds().toString().padStart(2, `0`)
        if (format === `YYYY-MM-DD`) {
            return `${y}-${m}-${d}`
        } else {
            return `${y}-${m}-${d} ${h}:${min}:${s}`
        }
    }

    /**
     * Bilgiyi çıktıla
     * @param {String} msg Mesaj
     * @return {undefined}
     */
    function log(msg) {
        if (!window.dev) {
            return false;
        }
        console.log(`${moment(new Date())}  ${msg}`)
    }

    /**
     * Çalışma bayrağını ayarla
     * @param {String} name
     * @return {undefined}
     */
    function setRunFlag(name) {
        let style = document.createElement(`style`);
        style.id = name;
        (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style); // HTML'ye düğüm ekleyin.
    }

    /**
     * Çalışma bayrağını al
     * @param {String} name
     * @return {undefined|Element}
     */
    function getRunFlag(name) {
        return document.getElementById(name);
    }

    /**
     * Çalışma bayrağı ayarlanmış mı diye kontrol et
     * @param {String} name
     * @return {Boolean}
     */
    function checkRunFlag(name) {
        if (getRunFlag(name)) {
            return true;
        } else {
            setRunFlag(name)
            return false;
        }
    }

    /**
     * Reklamı kaldırmak için kullanılan css stilini oluşturun ve HTML düğümüne ekleyin
     * @param {String} styles Stil metni
     * @return {undefined}
     */
    function generateRemoveADHTMLElement(styles) {
        // Zaten ayarlandıysa çık
        if (checkRunFlag(`RemoveADHTMLElement`)) {
            log(`Sayfa reklamları kaldırma düğümü zaten oluşturuldu`);
            return false
        }

        // Reklamı kaldırma stilini ayarla.
        let style = document.createElement(`style`); // style öğesi oluştur.
        (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style); // HTML'ye düğümü ekle.
        style.appendChild(document.createTextNode(styles)); // Stil düğümünü element düğümüne ekle.
        log(`Sayfa reklamları kaldırma düğümü başarıyla oluşturuldu`)
    }

    /**
     * Reklam kaldırma css metnini oluşturun
     * @param {Array} cssSelectorArr Ayarlanacak css seçici dizisi
     * @return {String}
     */
    function generateRemoveADCssText(cssSelectorArr) {
        cssSelectorArr.forEach((selector, index) => {
            cssSelectorArr[index] = `${selector}{display:none!important}`; // Dolaşıp stil ayarla.
        });
        return cssSelectorArr.join(` `); // Birleştir ve dizeye dönüştür.
    }

    /**
     * Dokunma olayı
     * @return {undefined}
     */
    function nativeTouch() {
        const minNum = 375;
        const maxNum = 750;
        const randomNum = (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum) / 1000;

        let element = this;
        // Dokunma nesnesi oluştur
        let touch = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: 12 + randomNum,
            clientY: 34 + randomNum,
            radiusX: 56 + randomNum,
            radiusY: 78 + randomNum,
            rotationAngle: 0,
            force: 1
        });

        // Dokunma Olayı oluştur
        let touchStartEvent = new TouchEvent("touchstart", {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        // touchstart olayını hedef öğeye gönder
        element.dispatchEvent(touchStartEvent);

        // Dokunma Olayı oluştur
        let touchEndEvent = new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        // touchend olayını hedef öğeye gönder
        element.dispatchEvent(touchEndEvent);
    }

    /**
     * Reklamları atla
     * @return {undefined}
     */
    function skipAd(mutationsList, observer) {
        let video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`); // Video öğesini al
        let skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
        let shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`);

        if (skipButton) {
            // Atlanabilir düğmeye sahip reklam.
            log(`Toplam Süre:`);
            log(`${video.duration}`)
            log(`Geçen Süre:`);
            log(`${video.currentTime}`)
            // Reklamı atla.
            skipButton.click(); // Bilgisayar
            nativeTouch.call(skipButton); // Telefon
            log(`Düğme reklamı atladı~~~~~~~~~~~~~`);
        } else if (shortAdMsg) {
            // Atlanabilir düğmeye sahip kısa reklam.
            log(`Toplam Süre:`);
            log(`${video.duration}`)
            log(`Geçen Süre:`);
            log(`${video.currentTime}`)
            video.currentTime = video.duration;
            log(`Zorla reklamı sonlandırdı~~~~~~~~~~~~~`);
        } else {
            log(`######Reklam Yok######`);
        }
    }

    /**
     * Oynatıcıdaki reklamları kaldır
     * @return {undefined}
     */
    function removePlayerAD() {
        // Zaten çalışıyorsa çık
        if (checkRunFlag(`removePlayerAD`)) {
            log(`Oynatıcıdaki reklam kaldırma özelliği zaten çalışıyor`);
            return false
        }
        let observer; // Gözlemci
        let timerID; // Zamanlayıcı

        // Gözlemi başlat
        function startObserve() {
            // Reklam düğümünü gözlemle
            const targetNode = document.querySelector(`.video-ads.ytp-ad-module`);
            if (!targetNode) {
                log(`İzlenecek hedef düğüm bulunuyor`);
                return false;
            }
            // Videodaki reklamları gözle ve işle
            const config = { childList: true, subtree: true }; // Hedef düğümün kendisiyle ve alt düğümlerle ilgili değişiklikleri gözle
            observer = new MutationObserver(skipAd); // Reklamları işleyen geri çağrı fonksiyonunu ayarlayan bir gözlemci örneği oluşturun
            observer.observe(targetNode, config); // Yukarıdaki yapılandırmayla reklam düğümünü gözlemlemeye başla
            timerID = setInterval(skipAd, 1000); // Kaçan balık
        }

        // Döngü görevi
        let startObserveID = setInterval(() => {
            if (!(observer && timerID)) {
                startObserve();
            } else {
                clearInterval(startObserveID);
            }
        }, 16);

        log(`Oynatıcıdaki reklam kaldırma özelliği başarıyla çalıştırıldı`)
    }

    /**
     * Ana fonksiyon
     */
    function main() {
        generateRemoveADHTMLElement(generateRemoveADCssText(cssSelectorArr)); // Arayüzdeki reklamları kaldırın.
        removePlayerAD(); // Oynatıcıdaki reklamları kaldırın.
    }

    if (document.readyState === `loading`) {
        log(`YouTube Reklam Engelleme betiği çağrılacak:`);
        document.addEventListener(`DOMContentLoaded`, main); // Bu sırada yükleme henüz tamamlanmadı
    } else {
        log(`YouTube Reklam Engelleme betiği hızlı çağrılacak:`);
        main(); // Bu sırada 'DOMContentLoaded' zaten tetiklendi
    }

})();
