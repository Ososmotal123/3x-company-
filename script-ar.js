const yearElementAr = document.getElementById("year");
if (yearElementAr) {
    yearElementAr.textContent = new Date().getFullYear();
}

const header = document.querySelector(".header");
const setHeaderScrolled = () => {
    if (!header) {
        return;
    }
    header.classList.toggle("header--scrolled", window.scrollY > 10);
};

const initReveal = () => {
    const targets = Array.from(document.querySelectorAll(".reveal, [data-animate]"));
    if (!targets.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        targets.forEach((el) => {
            el.classList.add("reveal", "is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.1,
        }
    );

    targets.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });
};

const initProcessInteractive = () => {
    const processSection = document.getElementById("process");
    if (!processSection) {
        return;
    }

    const steps = Array.from(processSection.querySelectorAll(".process-step[data-process-step]"));
    if (!steps.length) {
        return;
    }

    const card = processSection.querySelector(".process-hero-card");
    const detailTitle = processSection.querySelector("[data-process-detail-title]");
    const detailText = processSection.querySelector("[data-process-detail-text]");
    const pills = Array.from(processSection.querySelectorAll(".process-card-pills span[data-process-phase]"));
    const hasDetail = card && detailTitle && detailText;

    const setActiveStep = (step) => {
        steps.forEach((item) => {
            const isActive = item === step;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        if (hasDetail) {
            const title = step.querySelector("h3")?.textContent?.trim();
            const text = step.querySelector("p")?.textContent?.trim();
            if (title && text) {
                detailTitle.textContent = title;
                detailText.textContent = text;
                card.classList.remove("is-swapping");
                window.requestAnimationFrame(() => {
                    card.classList.add("is-swapping");
                });
            }
        }

        if (pills.length) {
            const phase = step.dataset.processPhase;
            pills.forEach((pill) => {
                pill.classList.toggle("is-active", pill.dataset.processPhase === phase);
            });
        }
    };

    steps.forEach((step) => {
        step.addEventListener("click", () => setActiveStep(step));
        step.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover)").matches) {
                setActiveStep(step);
            }
        });
        step.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveStep(step);
            }
        });
    });

    setActiveStep(steps[0]);
};

document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initProcessInteractive();
    setHeaderScrolled();
});

window.addEventListener("scroll", setHeaderScrolled, { passive: true });

const adminStorageKeyAr = "adminMode";
const adminBannerAr = document.getElementById("adminBanner");
const adminStatusAr = document.getElementById("adminStatus");
const adminLogoutAr = document.getElementById("adminLogout");

const setAdminOffsetAr = () => {
    if (adminBannerAr && !adminBannerAr.hidden) {
        document.documentElement.style.setProperty("--admin-offset", `${adminBannerAr.offsetHeight}px`);
    } else {
        document.documentElement.style.setProperty("--admin-offset", "0px");
    }
};

const updateAdminUIAr = () => {
    const isAdmin = localStorage.getItem(adminStorageKeyAr) === "true";
    if (adminBannerAr) {
        adminBannerAr.hidden = !isAdmin;
    }
    if (adminStatusAr) {
        adminStatusAr.textContent = isAdmin ? "تم تسجيل الدخول كمسؤول" : "";
    }
    document.body.classList.toggle("admin-mode", isAdmin);
    setAdminOffsetAr();
};

if (adminLogoutAr) {
    adminLogoutAr.addEventListener("click", () => {
        localStorage.removeItem(adminStorageKeyAr);
        updateAdminUIAr();
        window.location.href = "index-ar.html";
    });
}

window.addEventListener("resize", setAdminOffsetAr);
updateAdminUIAr();

const navToggleAr = document.getElementById("navToggle");
const mobileNavAr = document.getElementById("mobileNav");

if (navToggleAr && mobileNavAr) {
    navToggleAr.addEventListener("click", () => {
        mobileNavAr.classList.toggle("open");
    });

    mobileNavAr.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileNavAr.classList.remove("open");
        });
    });
}

const quoteFormAr = document.getElementById("quoteForm");
const formMessageAr = document.getElementById("formMessage");

if (quoteFormAr && formMessageAr) {
    const namePattern = /^[\p{L}\s'.-]{2,}$/u;
    const fullPhonePattern = /^\+\d[\d\s-]{6,14}$/;
    const serviceInput = document.getElementById("service");
    const serviceSuggest = document.getElementById("serviceSuggest");
    const attachmentsInput = document.getElementById("attachments");
    const attachmentsList = document.getElementById("attachmentsList");
    const attachmentsSummary = document.getElementById("attachmentsSummary");
    const attachmentsEmpty = document.getElementById("attachmentsEmpty");
    let resetAttachmentPreview = () => {};
    const serviceOptions = [
        {
            label: "أسقف وتفاصيل إضاءة",
            keywords: "أسقف إضاءة كوف تراي خطوط ظل",
        },
        {
            label: "جدران، ألواح وفواصل",
            keywords: "جدران ألواح فواصل كسوة تقسيم",
        },
        {
            label: "تجديد كامل / تجهيز",
            keywords: "تجديد كامل تجهيز قاعات غرف مساحات مشتركة",
        },
        {
            label: "أخرى / غير متأكد",
            keywords: "أخرى غير متأكد فكرة مخصص",
        },
    ];

    const showMessage = (text, isError = true) => {
        formMessageAr.textContent = text;
        formMessageAr.classList.toggle("is-error", isError);
        formMessageAr.classList.toggle("is-success", !isError);
    };

    const hideSuggestions = () => {
        if (serviceSuggest) {
            serviceSuggest.hidden = true;
            serviceSuggest.innerHTML = "";
        }
    };

    if (attachmentsInput && attachmentsList && attachmentsSummary && attachmentsEmpty) {
        const formatBytes = (bytes) => {
            if (!bytes) {
                return "0 B";
            }
            const units = ["B", "KB", "MB", "GB"];
            let size = bytes;
            let unitIndex = 0;
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex += 1;
            }
            return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
        };

        const resetPreview = () => {
            attachmentsList.innerHTML = "";
            attachmentsSummary.textContent = "لا توجد ملفات محددة.";
            attachmentsEmpty.hidden = false;
        };

        const isSameFile = (candidate, target) =>
            candidate &&
            target &&
            candidate.name === target.name &&
            candidate.size === target.size &&
            candidate.type === target.type &&
            candidate.lastModified === target.lastModified &&
            (candidate.webkitRelativePath || "") === (target.webkitRelativePath || "");

        const removeFile = (target) => {
            const files = Array.from(attachmentsInput.files || []);
            const removeIndex = files.findIndex((file) => isSameFile(file, target));
            if (removeIndex === -1) {
                return;
            }
            const dataTransfer = new DataTransfer();
            files.forEach((file, index) => {
                if (index !== removeIndex) {
                    dataTransfer.items.add(file);
                }
            });
            attachmentsInput.files = dataTransfer.files;
            updatePreview();
        };

        const buildPreviewCard = (file) => {
            const card = document.createElement("div");
            card.className = "file-preview-card";

            const thumb = document.createElement("div");
            thumb.className = "file-preview-thumb";

            if (file.type && file.type.startsWith("image/")) {
                const img = document.createElement("img");
                const objectUrl = URL.createObjectURL(file);
                img.src = objectUrl;
                img.alt = file.name;
                img.addEventListener("load", () => URL.revokeObjectURL(objectUrl));
                thumb.appendChild(img);
            } else {
                const ext = file.name.includes(".")
                    ? file.name.split(".").pop().slice(0, 4).toUpperCase()
                    : "FILE";
                thumb.textContent = ext || "FILE";
            }

            const meta = document.createElement("div");
            meta.className = "file-preview-meta";

            const name = document.createElement("span");
            name.className = "file-preview-name";
            name.textContent = file.name;

            const path = document.createElement("span");
            path.className = "file-preview-path";
            if (file.webkitRelativePath) {
                const trimmed = file.webkitRelativePath.replace(/\\/g, "/");
                if (trimmed && trimmed !== file.name) {
                    path.textContent = trimmed;
                }
            }

            const size = document.createElement("span");
            size.className = "file-preview-size";
            size.textContent = formatBytes(file.size);

            meta.appendChild(name);
            if (path.textContent) {
                meta.appendChild(path);
            }
            meta.appendChild(size);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "file-preview-remove";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label", `Remove ${file.name}`);
            removeButton.addEventListener("click", () => {
                removeFile(file);
            });

            card.appendChild(thumb);
            card.appendChild(meta);
            card.appendChild(removeButton);
            return card;
        };

        const updatePreview = () => {
            const files = Array.from(attachmentsInput.files || []);
            if (files.length === 0) {
                resetPreview();
                return;
            }

            attachmentsList.innerHTML = "";
            const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
            attachmentsSummary.textContent = `${files.length} file${files.length === 1 ? "" : "s"} selected • ${formatBytes(
                totalSize
            )}`;
            attachmentsEmpty.hidden = true;

            const fragment = document.createDocumentFragment();
            files.forEach((file) => {
                fragment.appendChild(buildPreviewCard(file));
            });
            attachmentsList.appendChild(fragment);
        };

        attachmentsInput.addEventListener("change", updatePreview);
        updatePreview();
        resetAttachmentPreview = resetPreview;
    }

    const normalize = (value) =>
        value
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}]+/gu, " ")
            .trim();

    const isSubsequence = (needle, haystack) => {
        if (!needle) {
            return false;
        }
        let index = 0;
        for (let i = 0; i < haystack.length; i += 1) {
            if (haystack[i] === needle[index]) {
                index += 1;
                if (index === needle.length) {
                    return true;
                }
            }
        }
        return false;
    };

    const indexedServiceOptions = serviceOptions.map((option, index) => {
        const labelNormalized = normalize(option.label);
        const keywordNormalized = normalize(option.keywords || "");
        const labelTokens = labelNormalized ? labelNormalized.split(" ") : [];
        const keywordTokens = keywordNormalized ? keywordNormalized.split(" ") : [];
        const allTokens = Array.from(new Set([...labelTokens, ...keywordTokens]));
        return {
            ...option,
            order: index,
            _index: {
                labelNormalized,
                keywordNormalized,
                labelTokens,
                keywordTokens,
                allTokens,
                compact: `${labelNormalized}${keywordNormalized}`.replace(/\s+/g, ""),
            },
        };
    });

    const scoreOption = (normalizedQuery, tokens, option) => {
        if (!normalizedQuery) {
            return 1;
        }
        const index = option._index;
        const haystack = `${index.labelNormalized} ${index.keywordNormalized}`.trim();
        let score = 0;
        let matched = 0;

        if (normalizedQuery === index.labelNormalized) {
            score += 40;
        } else if (index.labelNormalized.startsWith(normalizedQuery)) {
            score += 24;
        }

        tokens.forEach((token) => {
            if (!token) {
                return;
            }
            if (index.labelTokens.includes(token)) {
                score += 12;
                matched += 1;
                return;
            }
            if (index.keywordTokens.includes(token)) {
                score += 8;
                matched += 1;
                return;
            }
            if (index.labelTokens.some((word) => word.startsWith(token))) {
                score += 7;
                matched += 1;
                return;
            }
            if (haystack.includes(token)) {
                score += 4;
                matched += 1;
                return;
            }
            if (token.length > 2 && isSubsequence(token, index.compact)) {
                score += 2;
                matched += 1;
            }
        });

        if (matched > 0) {
            score += Math.round((matched / tokens.length) * 6);
        }

        return score;
    };

    let activeIndex = -1;
    const setActive = (nextIndex) => {
        const buttons = Array.from(serviceSuggest.querySelectorAll("button"));
        if (!buttons.length) {
            activeIndex = -1;
            serviceInput.removeAttribute("aria-activedescendant");
            return;
        }
        activeIndex = nextIndex;
        buttons.forEach((button, index) => {
            const isActive = index === activeIndex;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", isActive ? "true" : "false");
            if (isActive) {
                serviceInput.setAttribute("aria-activedescendant", button.id);
            }
        });
    };

    const renderSuggestions = (query) => {
        if (!serviceSuggest) {
            return;
        }

        const normalized = normalize(query);
        const tokens = normalized ? normalized.split(" ") : [];
        const matches = normalized
            ? indexedServiceOptions
                  .map((option) => ({
                      option,
                      score: scoreOption(normalized, tokens, option),
                  }))
                  .filter((entry) => entry.score > 0)
                  .sort((a, b) => b.score - a.score || a.option.order - b.option.order)
                  .map((entry) => entry.option)
            : indexedServiceOptions.map((option) => option);

        serviceSuggest.innerHTML = "";
        if (matches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "service-suggest-empty";
            empty.textContent = "لا توجد نتائج. جرّب كلمات أخرى.";
            serviceSuggest.appendChild(empty);
            serviceSuggest.hidden = false;
            return;
        }

        matches.slice(0, 6).forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "service-suggest-item";
            button.dataset.value = option.label;
            button.textContent = option.label;
            button.setAttribute("role", "option");
            button.id = `service-option-${index + 1}`;
            serviceSuggest.appendChild(button);
        });

        serviceSuggest.hidden = false;
        setActive(-1);
    };

    if (serviceInput && serviceSuggest) {
        hideSuggestions();

        serviceInput.setAttribute("role", "combobox");
        serviceInput.setAttribute("aria-expanded", "false");

        let inputTimer = 0;
        serviceInput.addEventListener("input", () => {
            window.clearTimeout(inputTimer);
            inputTimer = window.setTimeout(() => {
                renderSuggestions(serviceInput.value.trim());
                serviceInput.setAttribute(
                    "aria-expanded",
                    serviceSuggest.hidden ? "false" : "true"
                );
            }, 120);
        });

        serviceInput.addEventListener("focus", () => {
            renderSuggestions(serviceInput.value.trim());
            serviceInput.setAttribute(
                "aria-expanded",
                serviceSuggest.hidden ? "false" : "true"
            );
        });

        serviceInput.addEventListener("keydown", (event) => {
            if (serviceSuggest.hidden) {
                return;
            }
            const buttons = Array.from(serviceSuggest.querySelectorAll("button"));
            if (!buttons.length) {
                return;
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const next = activeIndex + 1 >= buttons.length ? 0 : activeIndex + 1;
                setActive(next);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const next = activeIndex - 1 < 0 ? buttons.length - 1 : activeIndex - 1;
                setActive(next);
            } else if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();
                const active = buttons[activeIndex];
                serviceInput.value = active.dataset.value;
                hideSuggestions();
                serviceInput.setAttribute("aria-expanded", "false");
                serviceInput.focus();
            } else if (event.key === "Escape") {
                hideSuggestions();
                serviceInput.setAttribute("aria-expanded", "false");
            }
        });

        serviceSuggest.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) {
                return;
            }
            serviceInput.value = button.dataset.value;
            hideSuggestions();
            serviceInput.setAttribute("aria-expanded", "false");
            serviceInput.focus();
        });

        document.addEventListener("click", (event) => {
            if (event.target === serviceInput || serviceSuggest.contains(event.target)) {
                return;
            }
            hideSuggestions();
            serviceInput.setAttribute("aria-expanded", "false");
        });
    }

    quoteFormAr.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.name.value.trim();
        const phone = this.phone.value.trim();
        const countryCode = this.countryCode ? this.countryCode.value.trim() : "+966";
        const area = this.area.value.trim();
        const service = this.service.value.trim();
        const message = this.message.value.trim();

        if (!namePattern.test(name)) {
            showMessage("يرجى إدخال الاسم الكامل بالحروف فقط.");
            return;
        }

        let fullPhone = phone;
        if (phone && !phone.startsWith("+")) {
            fullPhone = `${countryCode} ${phone}`.replace(/\s+/g, " ").trim();
        }

        if (!fullPhonePattern.test(fullPhone)) {
            showMessage("أدخل رقم هاتف صحيح مع كود الدولة (مثال: +966 50 420 2782).");
            return;
        }

        if (area.length < 2) {
            showMessage("يرجى تحديد الحي أو المنطقة في الرياض.");
            return;
        }

        if (!service) {
            showMessage("اختر نوع الخدمة المطلوبة.");
            return;
        }

        if (message.length < 10) {
            showMessage("يرجى كتابة تفاصيل كافية عن المشروع.");
            return;
        }

        const submitButton = this.querySelector("button[type='submit']");
        if (submitButton) {
            submitButton.disabled = true;
        }
        showMessage("جاري إرسال طلبك...", false);

        const formData = new FormData(this);
        formData.set("fullPhone", fullPhone);
        formData.set("language", "ar");

        try {
            const response = await fetch("/api/quote", {
                method: "POST",
                body: formData,
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.ok === false) {
                throw new Error("Request failed");
            }

            showMessage("تم استلام طلبك وسنتواصل معك قريبًا.", false);
            this.reset();
            hideSuggestions();
            resetAttachmentPreview();
            const resetAreaLat = document.getElementById("areaLat");
            const resetAreaLng = document.getElementById("areaLng");
            const resetAreaAddress = document.getElementById("areaAddress");
            if (resetAreaLat) {
                resetAreaLat.value = "";
            }
            if (resetAreaLng) {
                resetAreaLng.value = "";
            }
            if (resetAreaAddress) {
                resetAreaAddress.value = "";
            }
        } catch (err) {
            showMessage("تعذر إرسال الطلب. حاول مرة أخرى أو تواصل معنا مباشرة.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });}

const mapPickerBtn = document.getElementById("mapPickerBtn");
const mapModal = document.getElementById("mapModal");
const mapCanvas = document.getElementById("mapCanvas");
const mapSearch = document.getElementById("mapSearch");
const mapSearchBtn = document.getElementById("mapSearchBtn");
const mapResults = document.getElementById("mapResults");
const mapSaveBtn = document.getElementById("mapSaveBtn");
const mapFeedback = document.getElementById("mapFeedback");
const geoLocateBtn = document.getElementById("geoLocateBtn");
const geoStatus = document.getElementById("geoStatus");
const areaInput = document.getElementById("area");
const areaLatInput = document.getElementById("areaLat");
const areaLngInput = document.getElementById("areaLng");
const areaAddressInput = document.getElementById("areaAddress");

if (mapPickerBtn && mapModal && mapCanvas && areaInput) {
    let mapInstance;
    let mapMarker;
    let selectedLocation = null;
    const riyadhCenter = [24.7136, 46.6753];
    const riyadhBounds = [
        [24.38, 46.3],
        [24.98, 47.05],
    ];

    const setFeedback = (text) => {
        if (mapFeedback) {
            mapFeedback.textContent = text || "";
        }
    };

    const setGeoStatus = (text) => {
        if (geoStatus) {
            geoStatus.textContent = text || "";
        }
    };

    const setMarker = (lat, lng) => {
        if (!window.L || !mapInstance) {
            return;
        }
        const position = [lat, lng];
        if (!mapMarker) {
            mapMarker = L.marker(position).addTo(mapInstance);
        } else {
            mapMarker.setLatLng(position);
        }
    };

    const getFallbackLabel = (lat, lng) => `خط العرض ${lat.toFixed(5)}، خط الطول ${lng.toFixed(5)}`;
    const isFallbackLabel = (label, lat, lng) =>
        !label || label === getFallbackLabel(lat, lng);

    const setSelectedLocation = (lat, lng, label) => {
        const safeLabel = label || getFallbackLabel(lat, lng);
        selectedLocation = { lat, lng, label: safeLabel };
        if (mapInstance) {
            mapInstance.setView([lat, lng], 14);
        }
        setMarker(lat, lng);
        setFeedback(safeLabel);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                {
                    headers: {
                        "Accept-Language": "ar",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Reverse geocoding failed");
            }
            const data = await response.json();
            const label = data.display_name || getFallbackLabel(lat, lng);
            selectedLocation = { lat, lng, label };
            setFeedback(label);
            return label;
        } catch (error) {
            const fallbackLabel = getFallbackLabel(lat, lng);
            selectedLocation = { lat, lng, label: fallbackLabel };
            setFeedback(fallbackLabel);
            return fallbackLabel;
        }
    };

    const initMap = () => {
        if (mapInstance || !window.L) {
            return;
        }
        mapInstance = L.map(mapCanvas).setView(riyadhCenter, 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapInstance);
        mapInstance.setMaxBounds(riyadhBounds);
        mapInstance.on("click", (event) => {
            const { lat, lng } = event.latlng;
            setSelectedLocation(lat, lng);
            reverseGeocode(lat, lng);
        });
    };

    const openModal = () => {
        mapModal.hidden = false;
        document.body.classList.add("modal-open");
        initMap();
        setFeedback("");
        window.setTimeout(() => {
            if (mapInstance) {
                mapInstance.invalidateSize();
            }
        }, 200);
        if (areaLatInput && areaLngInput && areaLatInput.value && areaLngInput.value) {
            const lat = Number(areaLatInput.value);
            const lng = Number(areaLngInput.value);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                setSelectedLocation(lat, lng, areaAddressInput ? areaAddressInput.value : "");
                if (areaAddressInput && areaAddressInput.value) {
                    setFeedback(areaAddressInput.value);
                }
            }
        }
        if (mapSearch) {
            mapSearch.focus();
        }
    };

    const closeModal = () => {
        mapModal.hidden = true;
        document.body.classList.remove("modal-open");
    };

    const clearMapFields = () => {
        if (areaLatInput) {
            areaLatInput.value = "";
        }
        if (areaLngInput) {
            areaLngInput.value = "";
        }
        if (areaAddressInput) {
            areaAddressInput.value = "";
        }
    };

    const setAreaFields = (label, lat, lng) => {
        areaInput.value = label;
        areaInput.dataset.mapSelection = "true";
        if (areaLatInput) {
            areaLatInput.value = lat;
        }
        if (areaLngInput) {
            areaLngInput.value = lng;
        }
        if (areaAddressInput) {
            areaAddressInput.value = label;
        }
    };

    const renderResults = (results) => {
        if (!mapResults) {
            return;
        }
        mapResults.innerHTML = "";
        if (!results || results.length === 0) {
            setFeedback("لا توجد نتائج داخل الرياض.");
            return;
        }
        results.forEach((result) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "map-result-item";
            button.dataset.lat = result.lat;
            button.dataset.lon = result.lon;
            button.dataset.label = result.display_name;
            button.textContent = result.display_name;
            mapResults.appendChild(button);
        });
    };

    const searchPlaces = async () => {
        const query = mapSearch ? mapSearch.value.trim() : "";
        if (!query) {
            setFeedback("اكتب اسم حي أو موقع للبحث.");
            return;
        }
        setFeedback("جار البحث...");
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=sa&viewbox=46.3,24.98,47.05,24.38&bounded=1&q=${encodeURIComponent(
                    query
                )}`,
                {
                    headers: {
                        "Accept-Language": "ar",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Search failed");
            }
            const data = await response.json();
            setFeedback("");
            renderResults(data);
        } catch (error) {
            setFeedback("تعذر تحميل النتائج. حاول مرة أخرى.");
        }
    };

    mapPickerBtn.addEventListener("click", openModal);
    mapModal.querySelectorAll("[data-map-close]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !mapModal.hidden) {
            closeModal();
        }
    });
    areaInput.addEventListener("input", () => {
        if (areaInput.dataset.mapSelection) {
            areaInput.dataset.mapSelection = "";
            clearMapFields();
        }
        if (!areaInput.value) {
            clearMapFields();
        }
    });

    if (mapSearchBtn) {
        mapSearchBtn.addEventListener("click", searchPlaces);
    }
    if (mapSearch) {
        mapSearch.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                searchPlaces();
            }
        });
    }
    if (mapResults) {
        mapResults.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) {
                return;
            }
            const lat = Number(button.dataset.lat);
            const lng = Number(button.dataset.lon);
            const label = button.dataset.label;
            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                return;
            }
            setSelectedLocation(lat, lng, label);
            setFeedback(label);
        });
    }
    if (mapSaveBtn) {
        mapSaveBtn.addEventListener("click", async () => {
            if (!selectedLocation) {
                setFeedback("???? ????? ??? ??????? ????.");
                return;
            }
            const { lat, lng } = selectedLocation;
            let label = selectedLocation.label;
            if (isFallbackLabel(label, lat, lng)) {
                setFeedback("?? ????? ??? ??????...");
                label = await reverseGeocode(lat, lng);
            }
            setAreaFields(label, lat, lng);
            closeModal();
        });
    }

    if (geoLocateBtn) {
        if (!navigator.geolocation) {
            setGeoStatus("خدمة تحديد الموقع غير متاحة على هذا الجهاز.");
        } else {
            geoLocateBtn.addEventListener("click", () => {
                setGeoStatus("جاري تحديد موقعك الحالي...");
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const label = await reverseGeocode(latitude, longitude);
                        setAreaFields(label, latitude, longitude);
                        setGeoStatus("");
                    },
                    (error) => {
                        if (error && error.code === 1) {
                            setGeoStatus("تم رفض الوصول للموقع. الرجاء السماح بالموقع ثم المحاولة.");
                        } else {
                            setGeoStatus("تعذر تحديد موقعك الحالي. حاول مرة أخرى.");
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000,
                    }
                );
            });
        }
    }
}

const initImageLightbox = () => {
    const lightbox = document.getElementById("imageLightbox");
    if (!lightbox) {
        return;
    }

    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    if (!lightboxImage) {
        return;
    }

    const isArabic = document.documentElement.lang === "ar";
    const viewLabel = isArabic ? "عرض الصورة" : "View image";
    const fallbackCaption = isArabic ? "صورة المشروع" : "Project image";
    const iconSvg = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 3H3v4M3 7l5-5M17 3h4v4M21 7l-5-5M7 21H3v-4M3 17l5 5M17 21h4v-4M21 17l-5 5" />
        </svg>
    `;

    const openLightbox = (img) => {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt || "";
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || fallbackCaption;
        }
        lightbox.hidden = false;
        document.body.classList.add("modal-open");
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".project-image").forEach((wrapper) => {
        if (wrapper.querySelector(".project-image-button")) {
            return;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = "project-image-button";
        button.innerHTML = iconSvg;
        button.setAttribute("aria-label", viewLabel);
        button.dataset.lightboxTrigger = "true";
        const tags = wrapper.querySelector(".project-tags");
        if (tags) {
            wrapper.insertBefore(button, tags);
        } else {
            wrapper.appendChild(button);
        }
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((button) => {
        button.addEventListener("click", closeLightbox);
    });
    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-lightbox-trigger]");
        if (!trigger) {
            return;
        }
        const wrapper = trigger.closest(".project-image");
        const img = wrapper ? wrapper.querySelector("img") : null;
        if (!img) {
            return;
        }
        openLightbox(img);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !lightbox.hidden) {
            closeLightbox();
        }
    });
};

const initGalleryHero = () => {
    const heroCard = document.querySelector(".gallery-hero-card");
    const titleEl = heroCard ? heroCard.querySelector(".hero-card-title") : null;
    const descEl = heroCard ? heroCard.querySelector("p") : null;
    const chips = Array.from(document.querySelectorAll(".gallery-chip[data-gallery-chip]"));
    if (!heroCard || !titleEl || !descEl || chips.length === 0) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const contentMap = {
        villas: {
            title: "داخلي + خارجي",
            desc: "تنفيذ جبس يدوي مع تنسيق الإضاءة والعزل الصوتي والحواف الدقيقة.",
        },
        mosques: {
            title: "مساجد وقاعات",
            desc: "مساحات عبادة وقاعات بحلول صوتية متناغمة وتناسق وإضاءة متوازنة.",
        },
        majlis: {
            title: "جدران المجالس",
            desc: "ألواح وجدران مزخرفة وتفاصيل جبسية مهيأة لمجالس فاخرة.",
        },
        lighting: {
            title: "أسقف بإضاءة مدمجة",
            desc: "أسقف طبقية مع تجاويف LED وقواعد ثريات وممرات خدمات مخفية.",
        },
    };

    const setActiveChip = (chip) => {
        chips.forEach((btn) => btn.classList.toggle("is-active", btn === chip));
        const key = chip.dataset.galleryChip;
        const content = contentMap[key];
        if (content) {
            titleEl.textContent = content.title;
            descEl.textContent = content.desc;
        }
    };

    chips.forEach((chip) => {
        chip.addEventListener("click", () => setActiveChip(chip));
    });

    setActiveChip(chips[0]);

    if (prefersReducedMotion) {
        return;
    }

    const maxTilt = 6;
    heroCard.addEventListener("pointermove", (event) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.setProperty("--tilt-x", `${(-y * maxTilt).toFixed(2)}deg`);
        heroCard.style.setProperty("--tilt-y", `${(x * maxTilt).toFixed(2)}deg`);
    });
    heroCard.addEventListener("pointerleave", () => {
        heroCard.style.setProperty("--tilt-x", "0deg");
        heroCard.style.setProperty("--tilt-y", "0deg");
    });
};

const initGridToggle = ({ gridSelector, toggleSelector, defaultMoreLabel, defaultLessLabel }) => {
    const grid = document.querySelector(gridSelector);
    const toggle = document.querySelector(toggleSelector);

    if (!grid || !toggle) {
        return;
    }

    const collapsedClass = "is-collapsed";
    const moreLabel = toggle.dataset.moreLabel || defaultMoreLabel;
    const lessLabel = toggle.dataset.lessLabel || defaultLessLabel;

    const getVisibleCount = () => {
        if (window.matchMedia("(max-width: 640px)").matches) {
            return 1;
        }
        if (window.matchMedia("(max-width: 960px)").matches) {
            return 2;
        }
        return 3;
    };

    const setCollapsed = (collapsed) => {
        grid.classList.toggle(collapsedClass, collapsed);
        toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        toggle.textContent = collapsed ? moreLabel : lessLabel;
    };

    const updateToggleVisibility = () => {
        const visibleCount = getVisibleCount();
        const cards = grid.querySelectorAll(".project-card");
        const hasExtra = cards.length > visibleCount;

        toggle.hidden = !hasExtra;
        if (!hasExtra) {
            grid.classList.remove(collapsedClass);
            return;
        }

        setCollapsed(grid.classList.contains(collapsedClass));
    };

    setCollapsed(true);
    updateToggleVisibility();
    window.addEventListener("resize", updateToggleVisibility);

    toggle.addEventListener("click", () => {
        setCollapsed(!grid.classList.contains(collapsedClass));
    });
};

initGridToggle({
    gridSelector: ".project-grid-featured",
    toggleSelector: "[data-projects-toggle]",
    defaultMoreLabel: "عرض المزيد من المشاريع",
    defaultLessLabel: "عرض مشاريع أقل",
});

initGridToggle({
    gridSelector: ".card-grid-gallery",
    toggleSelector: "[data-gallery-toggle]",
    defaultMoreLabel: "عرض المزيد من المشاريع",
    defaultLessLabel: "عرض مشاريع أقل",
});

initGalleryHero();
initImageLightbox();





