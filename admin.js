(function (global) {
  "use strict";

  const shared = global.ShiftwiseAU;
  const ADMIN_STORAGE_KEY = "shiftwise-au-admin-v1";

  if (!shared || typeof document === "undefined") {
    return;
  }

  function normalizePasscode(value) {
    return String(value || "").trim();
  }

  function loadAppState() {
    try {
      const raw = global.localStorage?.getItem(shared.STORAGE_KEY);
      return raw ? shared.mergeState(JSON.parse(raw)) : shared.createDefaultState();
    } catch (error) {
      return shared.createDefaultState();
    }
  }

  function saveAppState(state) {
    const snapshot = shared.serializeState(state);
    global.localStorage?.setItem(shared.STORAGE_KEY, JSON.stringify(snapshot));
    return shared.mergeState(snapshot);
  }

  function loadAdminConfig() {
    try {
      const raw = JSON.parse(global.localStorage?.getItem(ADMIN_STORAGE_KEY) || "{}");
      return {
        passcode: normalizePasscode(raw.passcode || "")
      };
    } catch (error) {
      return {
        passcode: ""
      };
    }
  }

  function saveAdminConfig(config) {
    global.localStorage?.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
      passcode: normalizePasscode(config.passcode || "")
    }));
  }

  function hydrateTopLevelFromActiveProfile(state) {
    const activeProfile = state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0] || null;

    if (!activeProfile) {
      return state;
    }

    state.activeProfileId = activeProfile.id;
    state.activeCalendarMonth = activeProfile.activeCalendarMonth;
    state.settings = activeProfile.settings;
    state.holidays = activeProfile.holidays;
    state.shifts = activeProfile.shifts;
    state.expenses = activeProfile.expenses;
    state.subscriptions = activeProfile.subscriptions;
    state.savingsGoals = activeProfile.savingsGoals;
    state.debts = activeProfile.debts;
    return state;
  }

  function isValidEmail(value) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value || ""));
  }

  function countProfileItems(profile) {
    return (profile?.shifts?.length || 0)
      + (profile?.expenses?.length || 0)
      + (profile?.subscriptions?.length || 0)
      + (profile?.savingsGoals?.length || 0)
      + (profile?.debts?.length || 0);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const adminApp = {
    state: {
      app: loadAppState(),
      admin: loadAdminConfig(),
      unlocked: false,
      editingProfileId: ""
    },

    init() {
      this.cacheDom();
      this.bindEvents();
      this.applyTheme();
      this.renderAll();
    },

    cacheDom() {
      this.dom = {
        adminLockShell: document.getElementById("adminLockShell"),
        adminPanel: document.getElementById("adminPanel"),
        adminLockStatus: document.getElementById("adminLockStatus"),
        adminStatus: document.getElementById("adminStatus"),
        adminUnlockPane: document.getElementById("adminUnlockPane"),
        adminSetupPane: document.getElementById("adminSetupPane"),
        adminUnlockForm: document.getElementById("adminUnlockForm"),
        adminSetupForm: document.getElementById("adminSetupForm"),
        adminLockSummary: document.getElementById("adminLockSummary"),
        adminHeroMetrics: document.getElementById("adminHeroMetrics"),
        adminUserList: document.getElementById("adminUserList"),
        adminUserForm: document.getElementById("adminUserForm"),
        adminUserSubmitButton: document.getElementById("adminUserSubmitButton"),
        adminUserResetButton: document.getElementById("adminUserResetButton"),
        adminFormNote: document.getElementById("adminFormNote"),
        adminSummary: document.getElementById("adminSummary"),
        adminLockButton: document.getElementById("adminLockButton"),
        adminChangePasscodeButton: document.getElementById("adminChangePasscodeButton"),
        adminOpenAppButton: document.getElementById("adminOpenAppButton")
      };
    },

    bindEvents() {
      this.dom.adminUnlockForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleUnlock();
      });

      this.dom.adminSetupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleSetup();
      });

      this.dom.adminUserForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleUserSave();
      });

      this.dom.adminUserResetButton.addEventListener("click", () => {
        this.resetUserForm();
      });

      this.dom.adminLockButton.addEventListener("click", () => {
        this.lockPanel();
      });

      this.dom.adminChangePasscodeButton.addEventListener("click", () => {
        this.handlePasscodeChange();
      });

      this.dom.adminOpenAppButton.addEventListener("click", () => {
        global.location.href = "index.html";
      });

      document.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-admin-action]");

        if (!actionButton) {
          return;
        }

        const action = actionButton.dataset.adminAction;
        const profileId = actionButton.dataset.id || "";

        if (action === "edit-user") {
          this.startEdit(profileId);
        }

        if (action === "delete-user") {
          this.deleteUser(profileId);
        }
      });
    },

    applyTheme() {
      document.body.dataset.theme = this.state.app.theme === "dark" ? "dark" : "light";
    },

    showStatus(message, tone = "info") {
      const target = this.state.unlocked ? this.dom.adminStatus : this.dom.adminLockStatus;
      const other = this.state.unlocked ? this.dom.adminLockStatus : this.dom.adminStatus;

      if (other) {
        other.classList.add("hidden");
      }

      target.textContent = message;
      target.dataset.tone = tone;
      target.classList.remove("hidden");

      clearTimeout(this.statusTimer);
      this.statusTimer = global.setTimeout(() => {
        target.classList.add("hidden");
      }, 3600);
    },

    persistApp() {
      hydrateTopLevelFromActiveProfile(this.state.app);
      this.state.app = saveAppState(this.state.app);
      this.applyTheme();
    },

    renderAll() {
      const configured = Boolean(this.state.admin.passcode);
      document.body.classList.toggle("is-locked", !this.state.unlocked);
      this.dom.adminLockShell.classList.toggle("hidden", this.state.unlocked);
      this.dom.adminPanel.classList.toggle("hidden", !this.state.unlocked);
      this.dom.adminUnlockPane.classList.toggle("hidden", !configured);
      this.dom.adminSetupPane.classList.toggle("hidden", configured);

      this.renderLockSummary();
      this.renderHeroMetrics();

      if (this.state.unlocked) {
        this.renderUserList();
        this.renderUserForm();
        this.renderAdminSummary();
      }
    },

    renderLockSummary() {
      const profileCount = this.state.app.profiles.length;
      const pinCount = this.state.app.profiles.filter((profile) => profile.login?.pin).length;

      this.dom.adminLockSummary.innerHTML = [
        this.renderSummaryCard("Allowed users", String(profileCount)),
        this.renderSummaryCard("PIN enabled", String(pinCount)),
        this.renderSummaryCard("Scope", "This device only"),
        this.renderSummaryCard("Mode", "Offline-ready")
      ].join("");
    },

    renderHeroMetrics() {
      const profileCount = this.state.app.profiles.length;
      const pinCount = this.state.app.profiles.filter((profile) => profile.login?.pin).length;
      const totalRecords = this.state.app.profiles.reduce((sum, profile) => sum + countProfileItems(profile), 0);
      const activeProfile = this.state.app.profiles.find((profile) => profile.id === this.state.app.activeProfileId) || this.state.app.profiles[0];

      this.dom.adminHeroMetrics.innerHTML = [
        this.renderMetricCard("Allowed users", String(profileCount)),
        this.renderMetricCard("PIN enabled", String(pinCount)),
        this.renderMetricCard("Saved records", String(totalRecords)),
        this.renderMetricCard("Active profile", activeProfile?.name || "None")
      ].join("");
    },

    renderUserList() {
      const profiles = this.state.app.profiles.slice().sort((left, right) => left.name.localeCompare(right.name));

      if (profiles.length === 0) {
        this.dom.adminUserList.innerHTML = '<p class="empty-state">No users have been added yet.</p>';
        return;
      }

      this.dom.adminUserList.innerHTML = profiles.map((profile) => {
        const totalItems = countProfileItems(profile);
        const isActive = profile.id === this.state.app.activeProfileId;

        return `
          <article class="entry-card admin-user-card${this.state.editingProfileId === profile.id ? " is-editing" : ""}">
            <div class="entry-head">
              <div>
                <h3>${escapeHtml(profile.name)}</h3>
                <p>${escapeHtml(profile.login.email || "No email set")}${isActive ? " | currently active in Shiftwise" : ""}</p>
              </div>
              <div class="entry-amount">${totalItems}</div>
            </div>
            <div class="chip-list">
              <span class="chip">${escapeHtml(profile.login.email || "Email missing")}</span>
              <span class="chip">@${escapeHtml(profile.login.username || "")}</span>
              <span class="chip">${profile.login.pin ? "PIN enabled" : "PIN not set"}</span>
            </div>
            <div class="entry-actions">
              <button class="button secondary-button" data-admin-action="edit-user" data-id="${profile.id}" type="button">Edit user</button>
              <button class="button ghost-button" data-admin-action="delete-user" data-id="${profile.id}" type="button"${profiles.length <= 1 ? " disabled" : ""}>Delete user</button>
            </div>
          </article>
        `;
      }).join("");
    },

    renderUserForm() {
      const profile = this.state.app.profiles.find((entry) => entry.id === this.state.editingProfileId) || null;
      const form = this.dom.adminUserForm.elements;

      form.profileId.value = profile?.id || "";
      form.displayName.value = profile?.name || "";
      form.email.value = profile?.login?.email || "";
      form.username.value = profile?.login?.username || "";
      form.pin.value = profile?.login?.pin || "";
      this.dom.adminUserSubmitButton.textContent = profile ? "Save user" : "Add user";
      this.dom.adminFormNote.textContent = profile
        ? "Editing a user keeps their saved Shiftwise data on this device unless you delete the user."
        : "Leave username blank to generate one automatically from the email or display name.";
    },

    renderAdminSummary() {
      const profileCount = this.state.app.profiles.length;
      const pinCount = this.state.app.profiles.filter((profile) => profile.login?.pin).length;
      const emailCount = this.state.app.profiles.filter((profile) => profile.login?.email).length;
      const activeProfile = this.state.app.profiles.find((profile) => profile.id === this.state.app.activeProfileId) || this.state.app.profiles[0];

      this.dom.adminSummary.innerHTML = [
        this.renderSummaryCard("Allowed users", String(profileCount)),
        this.renderSummaryCard("Emails saved", String(emailCount)),
        this.renderSummaryCard("PIN unlocks", String(pinCount)),
        this.renderSummaryCard("Main app active", activeProfile?.name || "None")
      ].join("");
    },

    renderMetricCard(label, value) {
      return `
        <article class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `;
    },

    renderSummaryCard(label, value) {
      return `
        <article class="summary-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `;
    },

    handleSetup() {
      const passcode = normalizePasscode(this.dom.adminSetupForm.elements.passcode.value);
      const confirmPasscode = normalizePasscode(this.dom.adminSetupForm.elements.confirmPasscode.value);

      if (passcode.length < 6) {
        this.showStatus("Admin passcodes need at least 6 characters.", "error");
        return;
      }

      if (passcode !== confirmPasscode) {
        this.showStatus("The admin passcode confirmation does not match.", "error");
        return;
      }

      this.state.admin.passcode = passcode;
      saveAdminConfig(this.state.admin);
      this.state.unlocked = true;
      this.renderAll();
      this.showStatus("Admin passcode saved. You can now manage allowed users on this device.");
    },

    handleUnlock() {
      const passcode = normalizePasscode(this.dom.adminUnlockForm.elements.passcode.value);

      if (!passcode) {
        this.showStatus("Enter the admin passcode to continue.", "error");
        return;
      }

      if (passcode !== this.state.admin.passcode) {
        this.showStatus("That admin passcode was not correct.", "error");
        return;
      }

      this.state.unlocked = true;
      this.renderAll();
      this.showStatus("Admin panel unlocked.");
    },

    lockPanel() {
      this.state.unlocked = false;
      this.state.editingProfileId = "";
      this.dom.adminUnlockForm.reset();
      this.renderAll();
      this.showStatus("Admin panel locked.");
    },

    handlePasscodeChange() {
      const current = normalizePasscode(global.prompt("Enter the current admin passcode"));

      if (!current) {
        return;
      }

      if (current !== this.state.admin.passcode) {
        this.showStatus("The current admin passcode did not match.", "error");
        return;
      }

      const next = normalizePasscode(global.prompt("Enter the new admin passcode"));

      if (next.length < 6) {
        this.showStatus("New admin passcodes need at least 6 characters.", "error");
        return;
      }

      const confirmNext = normalizePasscode(global.prompt("Re-enter the new admin passcode"));

      if (next !== confirmNext) {
        this.showStatus("The new admin passcode confirmation did not match.", "error");
        return;
      }

      this.state.admin.passcode = next;
      saveAdminConfig(this.state.admin);
      this.showStatus("Admin passcode updated.");
    },

    startEdit(profileId) {
      this.state.editingProfileId = profileId;
      this.renderUserList();
      this.renderUserForm();
      this.dom.adminUserForm.elements.displayName.focus();
    },

    resetUserForm() {
      this.state.editingProfileId = "";
      this.dom.adminUserForm.reset();
      this.renderUserList();
      this.renderUserForm();
    },

    handleUserSave() {
      const form = this.dom.adminUserForm.elements;
      const profileId = String(form.profileId.value || "");
      const rawDisplayName = String(form.displayName.value || "").trim();
      const email = shared.normalizeEmail(form.email.value || "");
      const rawUsername = String(form.username.value || "").trim();
      const pin = shared.normalizePin(form.pin.value || "");
      const isEditing = Boolean(profileId);
      const existingProfile = this.state.app.profiles.find((profile) => profile.id === profileId) || null;

      if (!rawDisplayName) {
        this.showStatus("Enter a display name for the user.", "error");
        return;
      }

      if (!email || !isValidEmail(email)) {
        this.showStatus("Enter a valid email for the user.", "error");
        return;
      }

      const duplicateEmail = this.state.app.profiles.find((profile) => profile.id !== profileId && shared.normalizeEmail(profile.login?.email || "") === email);

      if (duplicateEmail) {
        this.showStatus("That email is already allowed on this device.", "error");
        return;
      }

      const duplicateName = this.state.app.profiles.find((profile) => profile.id !== profileId && String(profile.name || "").trim().toLowerCase() === rawDisplayName.toLowerCase());

      if (duplicateName) {
        this.showStatus("That display name is already used by another local user.", "error");
        return;
      }

      if (pin && (pin.length < 4 || pin.length > 6)) {
        this.showStatus("PINs need to be 4 to 6 digits.", "error");
        return;
      }

      const duplicatePin = pin
        ? this.state.app.profiles.find((profile) => profile.id !== profileId && profile.login?.pin === pin)
        : null;

      if (duplicatePin) {
        this.showStatus("That PIN is already used by another local user.", "error");
        return;
      }

      let username = shared.buildBaseUsername(rawUsername || email.split("@")[0] || rawDisplayName);

      if (/^\d+$/.test(username)) {
        username = `user${username}`;
      }

      if (rawUsername) {
        const duplicateUsername = this.state.app.profiles.find((profile) => profile.id !== profileId && profile.login?.username === username);

        if (duplicateUsername) {
          this.showStatus(`That username is already in use. Try ${shared.createUniqueUsername(username, this.state.app.profiles, profileId)} instead.`, "error");
          return;
        }
      } else {
        username = shared.createUniqueUsername(username, this.state.app.profiles, profileId);
      }

      const profile = existingProfile || shared.createDefaultProfile(rawDisplayName);
      profile.name = rawDisplayName;
      profile.login = {
        ...(profile.login || {}),
        email,
        username,
        pin
      };

      if (!existingProfile) {
        this.state.app.profiles.push(profile);
      }

      if (!this.state.app.profiles.some((entry) => entry.id === this.state.app.activeProfileId)) {
        this.state.app.activeProfileId = profile.id;
      }

      this.persistApp();
      this.state.editingProfileId = "";
      this.renderAll();
      this.showStatus(isEditing ? `Saved ${profile.name}.` : `Added ${profile.name} to the allowed users list.`);
      this.dom.adminUserForm.reset();
    },

    deleteUser(profileId) {
      if (this.state.app.profiles.length <= 1) {
        this.showStatus("Keep at least one local user on this device.", "error");
        return;
      }

      const profile = this.state.app.profiles.find((entry) => entry.id === profileId);

      if (!profile) {
        this.showStatus("That user could not be found.", "error");
        return;
      }

      const confirmed = global.confirm(`Delete ${profile.name} and all of their Shiftwise data from this device?`);

      if (!confirmed) {
        return;
      }

      this.state.app.profiles = this.state.app.profiles.filter((entry) => entry.id !== profileId);

      if (this.state.app.activeProfileId === profileId) {
        this.state.app.activeProfileId = this.state.app.profiles[0]?.id || "";
      }

      this.persistApp();

      if (this.state.editingProfileId === profileId) {
        this.state.editingProfileId = "";
      }

      this.renderAll();
      this.showStatus(`Deleted ${profile.name} from the allowed users list.`);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body?.dataset?.shiftwiseApp === "admin") {
      adminApp.init();
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
