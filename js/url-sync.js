(function () {
  // Requires globals defined in main.js; bail out gracefully if anything is missing.
  if (typeof nd === 'undefined' || !nd.store || typeof nb !== 'function' || typeof tb !== 'function' || typeof qc !== 'function' || typeof rc !== 'function' || typeof Q !== 'function' || typeof S !== 'function') {
    return;
  }

  const store = nd.store;
  const params = new URLSearchParams(window.location.search);
  const hadParams = params.has('primary') || params.has('secondary');
  let everPersisted = hadParams;
  const defaultPrimaryHex = typeof Bc !== 'undefined' ? Q(S(Bc)).toLowerCase() : null;

  const normalizeHexParam = (value) => {
    if (!value || typeof value !== 'string') return null;
    const cleaned = value.trim().replace(/^%23/, '#');
    const stripped = cleaned.startsWith('#') ? cleaned.slice(1) : cleaned;
    const lowered = stripped.toLowerCase();
    return /^[0-9a-f]{3,8}$/.test(lowered) ? lowered : null;
  };

  const setColorFromParam = (value, setter) => {
    const normalized = normalizeHexParam(value);
    if (!normalized || typeof setter !== 'function') return;
    try {
      const color = tb(nb(normalized));
      store.dispatch(setter(color));
    } catch (error) {
      // Ignore invalid values; fall back to existing state.
    }
  };

  setColorFromParam(params.get('primary'), qc);
  setColorFromParam(params.get('secondary'), rc);

  let lastPrimary = null;
  let lastSecondary = null;
  let transitionsCleared = false;

  const clearPaletteTransitionBlock = () => {
    if (transitionsCleared) return;
    transitionsCleared = true;
    const removeClass = () => {
      document.documentElement.classList.remove('no-palette-transition');
      if (document.body) document.body.classList.remove('no-palette-transition');
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(removeClass);
    } else {
      removeClass();
    }
  };

  const syncUrl = () => {
    const state = store.getState();
    if (!state || !state.colors || !state.colors.primaryColor) return;

    const primaryHex = Q(S(state.colors.primaryColor)).toLowerCase();
    const secondaryHex = state.colors.secondaryColor ? Q(S(state.colors.secondaryColor)).toLowerCase() : null;

    if (primaryHex === lastPrimary && secondaryHex === lastSecondary) return;

    const shouldPersist = hadParams || everPersisted || (defaultPrimaryHex ? primaryHex !== defaultPrimaryHex : true) || !!secondaryHex;
    if (!shouldPersist) return;

    const url = new URL(window.location.href);
    url.searchParams.set('primary', primaryHex);
    if (secondaryHex) {
      url.searchParams.set('secondary', secondaryHex);
    } else {
      url.searchParams.delete('secondary');
    }

    const next = url.pathname + url.search + url.hash;
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (next !== current) {
      window.history.replaceState(null, '', next);
      everPersisted = true;
    }

    lastPrimary = primaryHex;
    lastSecondary = secondaryHex;
  };

  syncUrl();
  clearPaletteTransitionBlock();
  store.subscribe(() => {
    syncUrl();
    clearPaletteTransitionBlock();
  });
})();
