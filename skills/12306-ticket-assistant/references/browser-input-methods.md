# 12306 Browser Input Methods

## Critical: Correct Input Method for 12306

**Problem:** Simple `fill` or `type` commands DO NOT work on 12306 input fields. They do not trigger the dropdown suggestion menu, leading to incorrect station selection and failed queries.

**Solution:** Use JavaScript to simulate complete keyboard event sequences, then select options via keyboard.

## Input Field IDs

- **出发地 (Departure)**: `fromStationText`
- **到达地 (Destination)**: `toStationText`
- **日期 (Date)**: `train_date`

## Step 1: Open Browser with Visible Window

```bash
agent-browser --headed open https://www.12306.cn/index/index.html
```

**IMPORTANT:** Always use `--headed` flag to see the browser window and verify dropdown menus appear.

## Step 2: Simulate Real Keyboard Input

Use JavaScript to trigger complete event sequence (keydown → input → keyup):

```javascript
// Get input field
const input = document.getElementById('toStationText');

// Clear and focus
input.value = '';
input.focus();
input.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

// Type character by character (200ms delay between characters)
const text = '郴州西';
let i = 0;

function typeNext() {
  if (i < text.length) {
    const char = text[i];
    input.value += char;

    // Trigger full event sequence
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      bubbles: true,
      cancelable: true
    }));
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: char
    }));
    input.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      bubbles: true,
      cancelable: true
    }));
    input.dispatchEvent(new Event('change', {bubbles: true}));

    i++;
    setTimeout(typeNext, 200);
  }
}

typeNext();
```

**Execute via agent-browser:**

```bash
agent-browser eval "
const input = document.getElementById('toStationText');
input.value = '';
input.focus();
const text = '郴州西';
let i = 0;
function typeNext() {
  if (i < text.length) {
    input.value += text[i];
    input.dispatchEvent(new KeyboardEvent('keydown', {key: text[i], bubbles: true}));
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    input.dispatchEvent(new KeyboardEvent('keyup', {key: text[i], bubbles: true}));
    i++;
    setTimeout(typeNext, 200);
  }
}
typeNext();
"
```

## Step 3: Select Dropdown Option

**Method 1: Keyboard Selection (RECOMMENDED)**

```bash
# Focus input field
agent-browser focus e40

# Press ArrowDown to select first option
agent-browser press ArrowDown

# Press Enter to confirm
agent-browser press Enter
```

**Method 2: Click Dropdown via JavaScript**

```javascript
// Find and click the dropdown option
setTimeout(() => {
  // Try multiple selector patterns for dropdown
  const dropdown = document.querySelector('.ac_results') ||
                   document.querySelector('[role="listbox"]') ||
                   document.querySelector('.autocomplete-suggestions');

  if (dropdown) {
    const options = dropdown.querySelectorAll('li, div, a');
    for (let option of options) {
      if (option.textContent.includes('郴州西')) {
        option.click();
        break;
      }
    }
  }
}, 1000); // Wait for dropdown to appear
```

## Step 4: Verify Selection

Always verify the input was filled correctly:

```bash
agent-browser screenshot
```

Or check via JavaScript:

```javascript
const input = document.getElementById('toStationText');
console.log('Current value:', input.value);

// Check hidden field (stores actual station code)
const hiddenInput = document.getElementById('toStation');
console.log('Station code:', hiddenInput.value);
```

## Common Pitfalls

### ❌ WRONG: Using fill command

```bash
# Does NOT trigger dropdown - station not properly selected
agent-browser fill e40 "郴州西"
```

### ❌ WRONG: Using type command

```bash
# Does NOT trigger dropdown on 12306
agent-browser type e40 "郴州西"
```

### ❌ WRONG: Simple value assignment

```javascript
// Does NOT trigger any events - dropdown won't appear
document.getElementById('toStationText').value = '郴州西';
```

### ✅ CORRECT: Full event simulation + keyboard selection

```bash
# 1. Simulate typing with events
agent-browser eval "<javascript-code-above>"

# 2. Select with keyboard
agent-browser focus e40
agent-browser press ArrowDown
agent-browser press Enter
```

## Complete Example: Query from Shenzhen to Chenzhou

```bash
# 1. Open browser
agent-browser --headed open https://www.12306.cn/index/index.html

# 2. Input departure station
agent-browser eval "
const input = document.getElementById('fromStationText');
input.value = '';
input.focus();
const text = '深圳';
let i = 0;
function typeNext() {
  if (i < text.length) {
    input.value += text[i];
    input.dispatchEvent(new KeyboardEvent('keydown', {key: text[i], bubbles: true}));
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    input.dispatchEvent(new KeyboardEvent('keyup', {key: text[i], bubbles: true}));
    i++;
    setTimeout(typeNext, 200);
  }
}
typeNext();
"

sleep 1
agent-browser focus e39
agent-browser press ArrowDown
sleep 0.3
agent-browser press Enter

# 3. Input destination station
agent-browser eval "
const input = document.getElementById('toStationText');
input.value = '';
input.focus();
const text = '郴州西';
let i = 0;
function typeNext() {
  if (i < text.length) {
    input.value += text[i];
    input.dispatchEvent(new KeyboardEvent('keydown', {key: text[i], bubbles: true}));
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    input.dispatchEvent(new KeyboardEvent('keyup', {key: text[i], bubbles: true}));
    i++;
    setTimeout(typeNext, 200);
  }
}
typeNext();
"

sleep 1
agent-browser focus e40
agent-browser press ArrowDown
sleep 0.3
agent-browser press Enter

# 4. Input date
agent-browser eval "
const input = document.getElementById('train_date');
input.value = '2026-02-28';
input.focus();
input.dispatchEvent(new Event('input', {bubbles: true}));
input.dispatchEvent(new Event('change', {bubbles: true}));
"

# 5. Click query button
agent-browser snapshot -i
# Find query button ref and click
agent-browser click e42

# 6. Take screenshot of results
sleep 2
agent-browser screenshot /tmp/query-result.png
```

## Why This Complex Method?

12306 uses custom JavaScript for station autocomplete:

1. **Complex event listeners**: The dropdown is triggered by a specific sequence of keyboard events
2. **Station code validation**: Both visible text input (`toStationText`) and hidden code field (`toStation`) must be populated
3. **AJAX lookup**: Each keystroke triggers an asynchronous station lookup
4. **Dropdown selection**: Must select from dropdown menu to populate the hidden code field

Simple value assignment bypasses all this logic, resulting in:
- No dropdown appearing
- Hidden station code field remaining empty
- Query failing or returning wrong results

## Tips for Debugging

1. **Always use --headed**: See what's happening in real-time
2. **Check console logs**: Look for errors in station lookup
3. **Verify hidden fields**: Ensure both text and code fields are populated
4. **Take screenshots**: Verify dropdown appears and selection is correct
5. **Wait for AJAX**: Add delays between steps to allow async lookups to complete

```bash
# Check hidden station code field
agent-browser eval "console.log(document.getElementById('toStation').value)"
```
