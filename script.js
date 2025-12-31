// Set current year in footer if placeholder exists
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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

    const chips = Array.from(processSection.querySelectorAll(".process-chip[data-process-chip]"));
    const chipNote = processSection.querySelector("[data-process-chip-note]");
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

    if (chips.length) {
        const setActiveChip = (chip) => {
            chips.forEach((item) => {
                const isActive = item === chip;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
            if (chipNote) {
                chipNote.textContent = chip.dataset.chipNote || "";
            }
        };

        chips.forEach((chip) => {
            chip.addEventListener("click", () => setActiveChip(chip));
        });

        const defaultChip = chips.find((chip) => chip.classList.contains("is-active")) || chips[0];
        setActiveChip(defaultChip);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initProcessInteractive();
    setHeaderScrolled();
});

window.addEventListener("scroll", setHeaderScrolled, { passive: true });

const isArabic = document.documentElement.lang === "ar";
const uiStrings = {
    en: {
        adminSignedIn: "Signed in as root",
        adminAlready: "Admin mode already enabled. Go to the homepage.",
        adminEnabled: "Admin mode enabled. Redirecting...",
        invalidCreds: "Invalid credentials. Use root / root.",
        servicePrompt: "Select the service type that best matches your request.",
        detailPrompt: "Share more project details so we can prepare your quote.",
        successMessage: "Thank you. Your request has been recorded. We will contact you as soon as possible.",
        sendingMessage: "Sending your request...",
        sendFailed: "We could not send your request. Please try again or contact us directly.",
        nameInvalid: "Please enter your full name using letters only.",
        phoneInvalid: "Enter a valid phone or WhatsApp number with a country code (e.g., +966 50 420 2782).",
        areaInvalid: "Specify the Riyadh district or neighborhood for your project.",
        viewImage: "View image",
        fallbackCaption: "Project image",
        projects: {
            summary: ({ count, total, label }) => `Showing ${count} of ${total} featured projects for ${label}.`,
        },
        attachmentsEmpty: "No files selected.",
        planner: {
            defaultScope: "gypsum project",
            tiers: {
                essential: "Essential Gypsum",
                signature: "Signature Fit-Out",
                royal: "Royal Majlis Fit-Out",
            },
            complexityLabels: [
                "Clean + minimal",
                "Balanced",
                "Premium details",
                "Ornate finishes",
                "Royal-level detail",
            ],
            noAddons: "No add-ons selected",
            timelinePref: {
                standard: "Standard pace",
                fast: "Fast-track",
                relaxed: "Flexible pace",
            },
            summary: ({ scope, area, complexityLabel, tier, addOns }) => {
                const addonsText = addOns.length ? ` Includes ${addOns.join(", ")}.` : " Add add-ons to refine the scope.";
                return `For a ${area} sqm ${scope} with ${complexityLabel.toLowerCase()} detailing, we suggest the ${tier} package.${addonsText}`;
            },
            timelineValue: (weeks) => `${weeks}-${weeks + 2} weeks`,
        },
        map: {
            searchPrompt: "Enter a place or district to search.",
            searching: "Searching...",
            noResults: "No results found in Riyadh.",
            unableToLoad: "Unable to load map results. Try again.",
            selectFirst: "Select a location on the map first.",
            fetching: "Fetching place name...",
            reverseFallback: (lat, lng) => `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`,
        },
        geo: {
            locating: "Locating you...",
            unsupported: "Location services are not available in this browser.",
            permissionDenied: "Location permission was denied.",
            unavailable: "Location information is unavailable.",
            timeout: "Location request timed out. Try again.",
            failed: "Unable to retrieve your location.",
            success: "Location captured. You can refine it on the map.",
        },
    },
    ar: {
        adminSignedIn: "تم تسجيل الدخول كمسؤول",
        adminAlready: "وضع الإدارة مفعّل بالفعل. انتقل إلى الصفحة الرئيسية.",
        adminEnabled: "تم تفعيل وضع الإدارة. جارٍ التحويل...",
        invalidCreds: "بيانات الدخول غير صحيحة. استخدم root / root.",
        servicePrompt: "اختر نوع الخدمة الأنسب لطلبك.",
        detailPrompt: "يرجى مشاركة تفاصيل أكثر عن المشروع لإعداد العرض.",
        successMessage: "شكرًا لك. تم استلام طلبك وسنتواصل معك قريبًا.",
        sendingMessage: "جاري إرسال طلبك...",
        sendFailed: "تعذر إرسال الطلب. حاول مرة أخرى أو تواصل معنا مباشرة.",
        nameInvalid: "يرجى إدخال الاسم الكامل باستخدام الأحرف فقط.",
        phoneInvalid: "أدخل رقم هاتف صحيحًا مع مفتاح الدولة (مثال: ‎+966 50 420 2782).",
        areaInvalid: "يرجى تحديد الحي أو المنطقة داخل الرياض.",
        viewImage: "عرض الصورة",
        fallbackCaption: "صورة مشروع",
        projects: {
            summary: ({ count, total, label }) => `عرض ${count} من ${total} لمشاريع ${label}.`,
        },
        attachmentsEmpty: "لا توجد ملفات محددة.",
        planner: {
            defaultScope: "مشروع جبس",
            tiers: {
                essential: "باقة الجبس الأساسية",
                signature: "باقة التشطيب المميز",
                royal: "باقة المجلس الملكي",
            },
            complexityLabels: [
                "بسيط وهادئ",
                "متوازن",
                "تفاصيل فاخرة",
                "تشطيب مزخرف",
                "تفاصيل ملكية",
            ],
            noAddons: "بدون إضافات",
            timelinePref: {
                standard: "إيقاع قياسي",
                fast: "تسريع",
                relaxed: "إيقاع مرن",
            },
            summary: ({ scope, area, complexityLabel, tier, addOns }) => {
                const addonsText = addOns.length ? ` تشمل ${addOns.join("، ")}.` : " أضف خدمات لتحديد النطاق بدقة.";
                return `لمساحة ${area} متر مربع في ${scope} مع تفاصيل ${complexityLabel}، نوصي بـ ${tier}.${addonsText}`;
            },
            timelineValue: (weeks) => `تقريبا ${weeks}-${weeks + 2} أسابيع`,
        },
        map: {
            searchPrompt: "اكتب اسم حي أو معلم للبحث.",
            searching: "جارٍ البحث...",
            noResults: "لا توجد نتائج داخل الرياض.",
            unableToLoad: "تعذر تحميل النتائج. حاول مرة أخرى.",
            selectFirst: "اختر موقعًا على الخريطة أولًا.",
            fetching: "جارٍ جلب اسم الموقع...",
            reverseFallback: (lat, lng) => `خط العرض ${lat.toFixed(5)}، خط الطول ${lng.toFixed(5)}`,
        },
    },
};
const copy = isArabic ? uiStrings.ar : uiStrings.en;

const adminStorageKey = "adminMode";
const adminBanner = document.getElementById("adminBanner");
const adminStatus = document.getElementById("adminStatus");
const adminLogout = document.getElementById("adminLogout");

const setAdminOffset = () => {
    if (adminBanner && !adminBanner.hidden) {
        document.documentElement.style.setProperty("--admin-offset", `${adminBanner.offsetHeight}px`);
    } else {
        document.documentElement.style.setProperty("--admin-offset", "0px");
    }
};

const updateAdminUI = () => {
    const isAdmin = localStorage.getItem(adminStorageKey) === "true";
    if (adminBanner) {
        adminBanner.hidden = !isAdmin;
    }
    if (adminStatus) {
        adminStatus.textContent = isAdmin ? copy.adminSignedIn : "";
    }
    document.body.classList.toggle("admin-mode", isAdmin);
    setAdminOffset();
};

if (adminLogout) {
    adminLogout.addEventListener("click", () => {
        localStorage.removeItem(adminStorageKey);
        updateAdminUI();
        window.location.href = isArabic ? "index-ar.html" : "index.html";
    });
}

window.addEventListener("resize", setAdminOffset);
updateAdminUI();

// Mobile navigation toggle
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
    const setMobileNavState = (isOpen) => {
        mobileNav.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) {
            const firstLink = mobileNav.querySelector("a");
            if (firstLink) {
                firstLink.focus();
            }
        }
    };

    navToggle.addEventListener("click", () => {
        const isOpen = !mobileNav.classList.contains("open");
        setMobileNavState(isOpen);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMobileNavState(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileNav.classList.contains("open")) {
            setMobileNavState(false);
            navToggle.focus();
        }
    });
}

const signinForm = document.getElementById("signinForm");
const signinMessage = document.getElementById("signinMessage");

if (signinForm && signinMessage) {
    const showSigninMessage = (text, isError = true) => {
        signinMessage.textContent = text;
        signinMessage.classList.toggle("is-error", isError);
        signinMessage.classList.toggle("is-success", !isError);
    };

    if (localStorage.getItem(adminStorageKey) === "true") {
        showSigninMessage(copy.adminAlready, false);
    }

    signinForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("signinEmail").value.trim();
        const password = document.getElementById("signinPassword").value.trim();

        if (username === "root" && password === "root") {
            localStorage.setItem(adminStorageKey, "true");
            showSigninMessage(copy.adminEnabled, false);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 600);
        } else {
            showSigninMessage(copy.invalidCreds);
        }
    });
}

// Simple front-end handling for the quote form
const quoteForm = document.getElementById("quoteForm");
const formMessage = document.getElementById("formMessage");

if (quoteForm && formMessage) {
    const namePattern = /^[\p{L}\s'.-]{2,}$/u;
    const fullPhonePattern = /^\+\d[\d\s-]{6,14}$/;
    const serviceInput = document.getElementById("service");
    const serviceSuggest = document.getElementById("serviceSuggest");
    const attachmentsInput = document.getElementById("attachments");
    const attachmentsList = document.getElementById("attachmentsList");
    const attachmentsSummary = document.getElementById("attachmentsSummary");
    const attachmentsEmpty = document.getElementById("attachmentsEmpty");
    let resetAttachmentPreview = () => {};
    const serviceOptions = isArabic
        ? [
              {
                  label: "أسقف وتفاصيل إضاءة",
                  meta: "كرانيش، قباب، تجاويف، فتحات إضاءة",
                  priority: 1,
                  keywords:
                      "سقف اسقف جبس جبس بورد قبة قباب تجويف تجاويف كرانيش كورنيش مخفي مخفية إضاءة سبوت لايت ليد",
              },
              {
                  label: "جدران، لوحات وفواصل",
                  meta: "حوائط مميزة، نيش، فواصل",
                  priority: 2,
                  keywords:
                      "جدار جدران حائط حوائط لوحات فواصل تقسيمات نيش رفوف جبس جبس بورد",
              },
              {
                  label: "كرانيش وزخارف وتريم",
                  meta: "تفاصيل كلاسيكية وأعمدة وأقواس",
                  priority: 3,
                  keywords:
                      "كرانيش كورنيش زخارف أعمدة أقواس تيجان تفاصيل كلاسيك جبس",
              },
              {
                  label: "قباب وأقواس ونقاط مميزة",
                  meta: "قباب وأقواس ومراكز زخرفية",
                  priority: 4,
                  keywords:
                      "قبة قباب قوس أقواس مركز نجفة مدالية زخارف جبس",
              },
              {
                  label: "مجالس ومساجد ومساحات تراثية",
                  meta: "مساحات ملكية ودينية",
                  priority: 5,
                  keywords:
                      "مجلس مجالس مسجد مساجد محراب منبر تراث ملكي كلاسيك جبس",
              },
              {
                  label: "ضيافة وقاعات مناسبات",
                  meta: "قاعات فنادق ومطاعم",
                  priority: 6,
                  keywords:
                      "قاعة قاعات فندق فنادق مطعم مطاعم صالة مناسبات أفراح ضيافة جبس",
              },
              {
                  label: "تشطيب كامل / فيت أوت",
                  meta: "تنفيذ متكامل من البداية للنهاية",
                  priority: 7,
                  keywords:
                      "تشطيب تشطيبات فيت اوت فيت-اوت ترميم تجديد إعادة تأهيل دهان أرضيات كهرباء تنسيق",
              },
              {
                  label: "إصلاحات وتحديثات",
                  meta: "إصلاح تشققات وتجديدات",
                  priority: 8,
                  keywords:
                      "إصلاح صيانة ترميم شقوق تشققات تصليح تحديث جبس",
              },
              {
                  label: "أخرى / غير متأكد",
                  meta: "نساعدك في تحديد النطاق",
                  priority: 9,
                  keywords: "أخرى غير متأكد استشارة فكرة أفكار تقدير",
              },
          ]
        : [
              {
                  label: "Ceilings & lighting details",
                  meta: "Coves, domes, trays, lighting cutouts",
                  priority: 1,
                  keywords:
                      "ceiling ceilings false drop suspended cove coves tray trays coffered bulkhead soffit shadow line lines dome domes chandelier medallion center centerpiece recess recessed led strip strips downlight spot light lighting gypsum",
              },
              {
                  label: "Walls, panels & partitions",
                  meta: "Feature walls, niches, partitions",
                  priority: 2,
                  keywords:
                      "wall walls panel panels partition partitions divider dividers cladding tv media feature wall niche niches shelving wainscot slat gypsum",
              },
              {
                  label: "Cornices, mouldings & trims",
                  meta: "Ornate trims, columns, arches",
                  priority: 3,
                  keywords:
                      "cornice cornices moulding mouldings trim trims crown molding cove trim rosette medallion column columns pilaster arch arches gypsum ornament decorative",
              },
              {
                  label: "Domes, arches & feature centers",
                  meta: "Feature domes, arches, centers",
                  priority: 4,
                  keywords:
                      "dome domes arch arches vault vaults centerpiece center feature ceiling chandelier base medallion gypsum",
              },
              {
                  label: "Majlis, mosques & heritage spaces",
                  meta: "Sacred + royal spaces",
                  priority: 5,
                  keywords:
                      "majlis mosque masjid mihrab minbar prayer hall heritage classical royal diwaniya council gypsum",
              },
              {
                  label: "Hospitality & event halls",
                  meta: "High-traffic hospitality venues",
                  priority: 6,
                  keywords:
                      "wedding hall ballroom hotel restaurant reception banquet conference hospitality venue event hall lobby gypsum",
              },
              {
                  label: "Full space renovation / fit-out",
                  meta: "End-to-end gypsum renovation",
                  priority: 7,
                  keywords:
                      "full renovation remodel refurbish rebuild strip-out demolition fit-out fitout turnkey villa palace apartment suite office residential commercial gypsum",
              },
              {
                  label: "Repairs, patching & upgrades",
                  meta: "Fixes, cracks, and upgrades",
                  priority: 8,
                  keywords:
                      "repair repairs patch patching crack cracks damage damaged restore restoration refinish repaint upgrade gypsum",
              },
              {
                  label: "Other / not sure",
                  meta: "We will help you scope it",
                  priority: 9,
                  keywords: "custom other unsure idea ideas guidance consult consultation estimate budget",
              },
          ];

    const showMessage = (text, isError = true) => {
        formMessage.textContent = text;
        formMessage.classList.toggle("is-error", isError);
        formMessage.classList.toggle("is-success", !isError);
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
            attachmentsSummary.textContent = copy.attachmentsEmpty;
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

    const synonymMap = {
        ceiling: ["ceilings", "false", "drop", "suspended", "tray", "coffered", "bulkhead", "soffit", "cove", "dome"],
        lighting: ["light", "lights", "led", "downlight", "spot", "chandelier"],
        wall: ["walls", "panel", "panels", "partition", "partitions", "feature", "tv", "cladding"],
        mosque: ["masjid", "mihrab", "minbar", "prayer"],
        majlis: ["diwaniya", "council", "royal"],
        hotel: ["hospitality", "restaurant", "lobby", "banquet", "ballroom"],
        renovation: ["remodel", "refurbish", "rebuild", "fitout", "fit"],
        repair: ["repairs", "patch", "patching", "crack", "restore", "restoration"],
        dome: ["domes", "cupola", "centerpiece"],
        arch: ["arches", "vault", "vaults"],
        column: ["columns", "pilaster"],
    };

    const expandTokens = (tokens) => {
        const expanded = new Set(tokens);
        tokens.forEach((token) => {
            const synonyms = synonymMap[token];
            if (synonyms) {
                synonyms.forEach((synonym) => expanded.add(synonym));
            }
            if (token.endsWith("s") && token.length > 3) {
                expanded.add(token.slice(0, -1));
            }
        });
        return Array.from(expanded);
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

    const scoreOption = (normalizedQuery, tokens, expandedTokens, option) => {
        if (!normalizedQuery) {
            return { score: 1, matchTerms: [] };
        }
        const index = option._index;
        const haystack = `${index.labelNormalized} ${index.keywordNormalized}`.trim();
        let score = 0;
        let matched = 0;
        const matchTerms = new Set();

        if (normalizedQuery === index.labelNormalized) {
            score += 40;
        } else if (index.labelNormalized.startsWith(normalizedQuery)) {
            score += 24;
        }

        if (normalizedQuery.length > 3 && haystack.includes(normalizedQuery)) {
            score += 10;
        }

        expandedTokens.forEach((token) => {
            if (!token) {
                return;
            }
            if (index.labelTokens.includes(token)) {
                score += 12;
                matched += 1;
                matchTerms.add(token);
                return;
            }
            if (index.keywordTokens.includes(token)) {
                score += 8;
                matched += 1;
                matchTerms.add(token);
                return;
            }
            if (index.labelTokens.some((word) => word.startsWith(token))) {
                score += 7;
                matched += 1;
                matchTerms.add(token);
                return;
            }
            if (haystack.includes(token)) {
                score += 4;
                matched += 1;
                matchTerms.add(token);
                return;
            }
            if (token.length > 2 && isSubsequence(token, index.compact)) {
                score += 2;
                matched += 1;
                matchTerms.add(token);
            }
        });

        if (matched > 0) {
            score += Math.round((matched / Math.max(tokens.length, 1)) * 6);
        }

        return { score, matchTerms: Array.from(matchTerms) };
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
        const expandedTokens = expandTokens(tokens);
        const matches = normalized
            ? indexedServiceOptions
                  .map((option) => {
                      const scored = scoreOption(normalized, tokens, expandedTokens, option);
                      return {
                          option,
                          score: scored.score,
                          matchTerms: scored.matchTerms,
                      };
                  })
                  .filter((entry) => entry.score > 0)
                  .sort(
                      (a, b) =>
                          b.score - a.score ||
                          (a.option.priority || 99) - (b.option.priority || 99) ||
                          a.option.order - b.option.order
                  )
            : indexedServiceOptions
                  .slice()
                  .sort(
                      (a, b) =>
                          (a.priority || 99) - (b.priority || 99) || a.order - b.order
                  )
                  .map((option) => ({ option, score: 1, matchTerms: [] }));

        serviceSuggest.innerHTML = "";
        if (matches.length === 0) {
            const empty = document.createElement("div");
            empty.className = "service-suggest-empty";
            empty.textContent = "No matches. Try another keyword.";
            serviceSuggest.appendChild(empty);
            serviceSuggest.hidden = false;
            return;
        }

        const buildMatchLabel = (matchTerms) => {
            if (!matchTerms || matchTerms.length === 0) {
                return "";
            }
            const limited = matchTerms.slice(0, 3);
            const extra = matchTerms.length > 3 ? ` +${matchTerms.length - 3}` : "";
            return `Matches: ${limited.join(", ")}${extra}`;
        };

        matches.slice(0, 6).forEach((entry, index) => {
            const { option, matchTerms } = entry;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "service-suggest-item";
            button.dataset.value = option.label;
            const title = document.createElement("span");
            title.className = "service-suggest-title";
            title.textContent = option.label;
            const meta = document.createElement("span");
            meta.className = "service-suggest-meta";
            meta.textContent = buildMatchLabel(matchTerms) || option.meta || "";
            if (meta.textContent) {
                button.appendChild(title);
                button.appendChild(meta);
            } else {
                button.appendChild(title);
            }
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

    quoteForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.name.value.trim();
        const phone = this.phone.value.trim();
        const countryCode = this.countryCode ? this.countryCode.value.trim() : "+966";
        const area = this.area.value.trim();
        const service = this.service.value.trim();
        const message = this.message.value.trim();

        if (!namePattern.test(name)) {
            showMessage(copy.nameInvalid);
            return;
        }

        let fullPhone = phone;
        if (phone && !phone.startsWith("+")) {
            fullPhone = `${countryCode} ${phone}`.replace(/\s+/g, " ").trim();
        }

        if (!fullPhonePattern.test(fullPhone)) {
            showMessage(copy.phoneInvalid);
            return;
        }

        if (area.length < 2) {
            showMessage(copy.areaInvalid);
            return;
        }

        if (!service) {
            showMessage(copy.servicePrompt);
            return;
        }

        if (message.length < 10) {
            showMessage(copy.detailPrompt);
            return;
        }

        const submitButton = this.querySelector("button[type='submit']");
        if (submitButton) {
            submitButton.disabled = true;
        }
        showMessage(copy.sendingMessage, false);

        const formData = new FormData(this);
        formData.set("fullPhone", fullPhone);
        formData.set("language", isArabic ? "ar" : "en");

        try {
            const response = await fetch("/api/quote", {
                method: "POST",
                body: formData,
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || result.ok === false) {
                throw new Error("Request failed");
            }

            showMessage(copy.successMessage, false);
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
            showMessage(copy.sendFailed);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

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

    const geoCopy = copy.geo || uiStrings.en.geo;
    const setGeoStatus = (text, isError = false) => {
        if (!geoStatus) {
            return;
        }
        geoStatus.textContent = text || "";
        geoStatus.classList.toggle("is-error", isError);
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

    const getFallbackLabel = (lat, lng) => copy.map.reverseFallback(lat, lng);
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
                        "Accept-Language": isArabic ? "ar" : "en",
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

    let lastFocusedElement = null;

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
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
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
            setFeedback(copy.map.noResults);
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
            setFeedback(copy.map.searchPrompt);
            return;
        }
        setFeedback(copy.map.searching);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=sa&viewbox=46.3,24.98,47.05,24.38&bounded=1&q=${encodeURIComponent(
                    query
                )}`,
                {
                    headers: {
                        "Accept-Language": isArabic ? "ar" : "en",
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
            setFeedback(copy.map.unableToLoad);
        }
    };

    mapPickerBtn.addEventListener("click", () => {
        lastFocusedElement = document.activeElement;
        openModal();
    });
    mapModal.querySelectorAll("[data-map-close]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !mapModal.hidden) {
            closeModal();
        }
    });
    areaInput.addEventListener("input", () => {
        setGeoStatus("");
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
                setFeedback(copy.map.selectFirst);
                return;
            }
            const { lat, lng } = selectedLocation;
            let label = selectedLocation.label;
            if (isFallbackLabel(label, lat, lng)) {
                setFeedback(copy.map.fetching);
                label = await reverseGeocode(lat, lng);
            }
            setAreaFields(label, lat, lng);
            closeModal();
        });
    }

    if (geoLocateBtn) {
        geoLocateBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                setGeoStatus(geoCopy.unsupported, true);
                return;
            }
            setGeoStatus(geoCopy.locating);
            geoLocateBtn.disabled = true;
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords || {};
                    if (typeof latitude !== "number" || typeof longitude !== "number") {
                        setGeoStatus(geoCopy.failed, true);
                        geoLocateBtn.disabled = false;
                        return;
                    }
                    setSelectedLocation(latitude, longitude);
                    const label = await reverseGeocode(latitude, longitude);
                    setAreaFields(label, latitude, longitude);
                    setGeoStatus(geoCopy.success);
                    geoLocateBtn.disabled = false;
                },
                (error) => {
                    let message = geoCopy.failed;
                    if (error && error.code === error.PERMISSION_DENIED) {
                        message = geoCopy.permissionDenied;
                    } else if (error && error.code === error.POSITION_UNAVAILABLE) {
                        message = geoCopy.unavailable;
                    } else if (error && error.code === error.TIMEOUT) {
                        message = geoCopy.timeout;
                    }
                    setGeoStatus(message, true);
                    geoLocateBtn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    }
}

const initPlanner = () => {
    const planner = document.getElementById("planner");
    if (!planner) {
        return;
    }

    const areaInput = planner.querySelector("#plannerArea");
    const areaValue = planner.querySelector("#plannerAreaValue");
    const complexityInput = planner.querySelector("#plannerComplexity");
    const complexityValue = planner.querySelector("#plannerComplexityValue");
    const timelinePref = planner.querySelector("#plannerTimelinePref");
    const focusEl = planner.querySelector("#plannerFocus");
    const addonsEl = planner.querySelector("#plannerAddOns");
    const tierEl = planner.querySelector("#plannerTier");
    const summaryEl = planner.querySelector("#plannerSummary");
    const crewEl = planner.querySelector("#plannerCrew");
    const timelineEl = planner.querySelector("#plannerTimeline");
    const scopeButtons = Array.from(planner.querySelectorAll(".planner-chip[data-scope]"));
    const timelineButtons = Array.from(planner.querySelectorAll(".planner-toggle[data-timeline]"));
    const addOnInputs = Array.from(planner.querySelectorAll("input[name='plannerAddOn']"));

    if (!areaInput || !complexityInput || !tierEl || !summaryEl) {
        return;
    }

    const plannerCopy = copy.planner || uiStrings.en.planner;
    const fallbackPlanner = uiStrings.en.planner;
    const complexityLabels = plannerCopy.complexityLabels || fallbackPlanner.complexityLabels;

    let activeScope = scopeButtons.find((button) => button.classList.contains("is-active")) || scopeButtons[0];
    let activeTimeline =
        timelineButtons.find((button) => button.classList.contains("is-active")) || timelineButtons[0];

    const setActiveButton = (buttons, activeButton) => {
        buttons.forEach((button) => {
            const isActive = button === activeButton;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    };

    const getAddOns = () =>
        addOnInputs
            .filter((input) => input.checked)
            .map((input) => input.dataset.label || "")
            .filter(Boolean);

    const updatePlanner = () => {
        const area = Number(areaInput.value) || 0;
        const complexityIndex = Math.max(0, Math.min(complexityLabels.length - 1, Number(complexityInput.value) - 1));
        const complexityLabel = complexityLabels[complexityIndex];
        const scopeText = activeScope ? activeScope.textContent.trim() : plannerCopy.defaultScope;
        const scopeForSummary = isArabic ? scopeText : scopeText.toLowerCase();
        const focusText = activeScope ? activeScope.dataset.focus || scopeText : scopeText;
        const addOns = getAddOns();

        if (areaValue) {
            areaValue.textContent = isArabic ? `${area} متر مربع` : `${area} sqm`;
        }
        if (complexityValue) {
            complexityValue.textContent = complexityLabel;
        }
        if (focusEl) {
            focusEl.textContent = focusText;
        }
        if (addonsEl) {
            addonsEl.textContent = addOns.length
                ? addOns.join(isArabic ? "، " : ", ")
                : plannerCopy.noAddons || fallbackPlanner.noAddons;
        }

        let tierKey = "essential";
        if (area > 1400 || complexityIndex >= 4) {
            tierKey = "royal";
        } else if (area > 800 || complexityIndex >= 3) {
            tierKey = "signature";
        }
        if (addOns.length >= 3 && tierKey === "essential") {
            tierKey = "signature";
        }
        if (addOns.length >= 4 && tierKey === "signature") {
            tierKey = "royal";
        }

        const tierLabel = (plannerCopy.tiers && plannerCopy.tiers[tierKey]) || fallbackPlanner.tiers[tierKey];
        if (tierEl) {
            tierEl.textContent = tierLabel;
        }

        const crewBase = Math.round(Math.min(28, Math.max(6, area / 75 + (complexityIndex + 1) * 2.3)));
        if (crewEl) {
            crewEl.textContent = `${crewBase}-${crewBase + 4}`;
        }

        const timelineKey = activeTimeline ? activeTimeline.dataset.timeline : "standard";
        const multiplier = Number(activeTimeline ? activeTimeline.dataset.multiplier : 1) || 1;
        const days = Math.round((area / 38 + (complexityIndex + 1) * 5) * multiplier);
        const weeks = Math.max(2, Math.round(days / 7));
        if (timelineEl) {
            timelineEl.textContent = plannerCopy.timelineValue
                ? plannerCopy.timelineValue(weeks, timelineKey)
                : fallbackPlanner.timelineValue(weeks, timelineKey);
        }
        if (timelinePref && plannerCopy.timelinePref && plannerCopy.timelinePref[timelineKey]) {
            timelinePref.textContent = plannerCopy.timelinePref[timelineKey];
        }

        if (plannerCopy.summary) {
            summaryEl.textContent = plannerCopy.summary({
                scope: scopeForSummary,
                area,
                complexityLabel,
                tier: tierLabel,
                addOns,
            });
        }
    };

    scopeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeScope = button;
            setActiveButton(scopeButtons, button);
            updatePlanner();
        });
    });

    timelineButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeTimeline = button;
            setActiveButton(timelineButtons, button);
            updatePlanner();
        });
    });

    areaInput.addEventListener("input", updatePlanner);
    complexityInput.addEventListener("input", updatePlanner);
    addOnInputs.forEach((input) => input.addEventListener("change", updatePlanner));

    updatePlanner();
};

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

    const viewLabel = copy.viewImage;
    const fallbackCaption = copy.fallbackCaption;
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    let lastFocusedElement = null;
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
        lastFocusedElement = document.activeElement;
        lightbox.hidden = false;
        document.body.classList.add("modal-open");
        if (closeButton) {
            closeButton.focus();
        }
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove("modal-open");
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
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

const initProjectsFilter = () => {
    const section = document.getElementById("projects");
    if (!section) {
        return;
    }

    const pills = Array.from(section.querySelectorAll(".projects-pill[data-project-filter]"));
    const cards = Array.from(section.querySelectorAll(".project-card[data-project-type]"));
    const summaryEl = section.querySelector("[data-projects-summary]");

    if (!pills.length || !cards.length) {
        return;
    }

    const summaryFn = (copy.projects && copy.projects.summary) || uiStrings.en.projects.summary;

    const updateSummary = (count, label) => {
        if (!summaryEl) {
            return;
        }
        summaryEl.textContent = summaryFn({
            count,
            total: cards.length,
            label,
        });
    };

    const setActive = (pill) => {
        pills.forEach((button) => {
            const isActive = button === pill;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        const filter = pill.dataset.projectFilter || "all";
        let visibleCount = 0;
        cards.forEach((card) => {
            const types = (card.dataset.projectType || "").split(" ").filter(Boolean);
            const matches = filter === "all" || types.includes(filter);
            card.classList.toggle("is-dimmed", !matches);
            card.setAttribute("aria-hidden", matches ? "false" : "true");
            if (matches) {
                visibleCount += 1;
            }
        });

        updateSummary(visibleCount, pill.textContent.trim());
    };

    pills.forEach((pill) => {
        pill.addEventListener("click", () => setActive(pill));
    });

    const defaultPill = pills.find((pill) => pill.classList.contains("is-active")) || pills[0];
    setActive(defaultPill);
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
            title: "Interior + Exterior",
            desc: "Hand-finished gypsum with lighting coordination, acoustic care, and precise edging.",
        },
        mosques: {
            title: "Mosques + Halls",
            desc: "High-capacity worship and hall interiors with acoustic balance, symmetry, and lighting control.",
        },
        majlis: {
            title: "Majlis Walls",
            desc: "Statement wall panels, cornices, and carved details crafted for royal majlis settings.",
        },
        lighting: {
            title: "Lighting-Integrated",
            desc: "Layered ceilings engineered around LED coves, chandeliers, and hidden service access.",
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
    defaultMoreLabel: "View more projects",
    defaultLessLabel: "Show fewer projects",
});

initGridToggle({
    gridSelector: ".card-grid-gallery",
    toggleSelector: "[data-gallery-toggle]",
    defaultMoreLabel: "View more projects",
    defaultLessLabel: "Show fewer projects",
});

initPlanner();
initProjectsFilter();
initGalleryHero();
initImageLightbox();
