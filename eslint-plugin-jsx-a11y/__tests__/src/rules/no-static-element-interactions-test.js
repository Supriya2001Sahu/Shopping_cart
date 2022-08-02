/**
 * @fileoverview Enforce static elements have no interactive handlers.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import { configs } from '../../../src/index';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/no-static-element-interactions';
import ruleOptionsMapperFactory from '../../__util__/ruleOptionsMapperFactory';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const errorMessage = 'Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.';

const expectedError = {
  message: errorMessage,
  type: 'JSXOpeningElement',
};

const ruleName = 'no-static-element-interactions';

const componentsSettings = {
  'jsx-a11y': {
    components: {
      Button: 'button',
      TestComponent: 'div',
    },
  },
};

const alwaysValid = [
  { code: '<TestComponent onClick={doFoo} />' },
  { code: '<Button onClick={doFoo} />' },
  { code: '<Button onClick={doFoo} />', settings: componentsSettings },
  { code: '<div />;' },
  { code: '<div className="foo" />;' },
  { code: '<div className="foo" {...props} />;' },
  { code: '<div onClick={() => void 0} aria-hidden />;' },
  { code: '<div onClick={() => void 0} aria-hidden={true} />;' },
  { code: '<div onClick={null} />;' },
  /* All flavors of input */
  { code: '<input onClick={() => void 0} />' },
  { code: '<input type="button" onClick={() => void 0} />' },
  { code: '<input type="checkbox" onClick={() => void 0} />' },
  { code: '<input type="color" onClick={() => void 0} />' },
  { code: '<input type="date" onClick={() => void 0} />' },
  { code: '<input type="datetime" onClick={() => void 0} />' },
  { code: '<input type="datetime-local" onClick={() => void 0} />' },
  { code: '<input type="email" onClick={() => void 0} />' },
  { code: '<input type="file" onClick={() => void 0} />' },
  { code: '<input type="hidden" onClick={() => void 0} />' },
  { code: '<input type="image" onClick={() => void 0} />' },
  { code: '<input type="month" onClick={() => void 0} />' },
  { code: '<input type="number" onClick={() => void 0} />' },
  { code: '<input type="password" onClick={() => void 0} />' },
  { code: '<input type="radio" onClick={() => void 0} />' },
  { code: '<input type="range" onClick={() => void 0} />' },
  { code: '<input type="reset" onClick={() => void 0} />' },
  { code: '<input type="search" onClick={() => void 0} />' },
  { code: '<input type="submit" onClick={() => void 0} />' },
  { code: '<input type="tel" onClick={() => void 0} />' },
  { code: '<input type="text" onClick={() => void 0} />' },
  { code: '<input type="time" onClick={() => void 0} />' },
  { code: '<input type="url" onClick={() => void 0} />' },
  { code: '<input type="week" onClick={() => void 0} />' },
  /* End all flavors of input */
  { code: '<button onClick={() => void 0} className="foo" />' },
  { code: '<datalist onClick={() => {}} />;' },
  { code: '<menuitem onClick={() => {}} />;' },
  { code: '<option onClick={() => void 0} className="foo" />' },
  { code: '<select onClick={() => void 0} className="foo" />' },
  { code: '<textarea onClick={() => void 0} className="foo" />' },
  { code: '<a onClick={() => void 0} href="http://x.y.z" />' },
  { code: '<a onClick={() => void 0} href="http://x.y.z" tabIndex="0" />' },
  { code: '<audio onClick={() => {}} />;' },
  { code: '<form onClick={() => {}} />;' },
  { code: '<form onSubmit={() => {}} />;' },
  { code: '<link onClick={() => {}} href="#" />;' },
  /* HTML elements attributed with an interactive role */
  { code: '<div role="button" onClick={() => {}} />;' },
  { code: '<div role="checkbox" onClick={() => {}} />;' },
  { code: '<div role="columnheader" onClick={() => {}} />;' },
  { code: '<div role="combobox" onClick={() => {}} />;' },
  { code: '<div role="form" onClick={() => {}} />;' },
  { code: '<div role="gridcell" onClick={() => {}} />;' },
  { code: '<div role="link" onClick={() => {}} />;' },
  { code: '<div role="menuitem" onClick={() => {}} />;' },
  { code: '<div role="menuitemcheckbox" onClick={() => {}} />;' },
  { code: '<div role="menuitemradio" onClick={() => {}} />;' },
  { code: '<div role="option" onClick={() => {}} />;' },
  { code: '<div role="radio" onClick={() => {}} />;' },
  { code: '<div role="rowheader" onClick={() => {}} />;' },
  { code: '<div role="searchbox" onClick={() => {}} />;' },
  { code: '<div role="slider" onClick={() => {}} />;' },
  { code: '<div role="spinbutton" onClick={() => {}} />;' },
  { code: '<div role="switch" onClick={() => {}} />;' },
  { code: '<div role="tab" onClick={() => {}} />;' },
  { code: '<div role="textbox" onClick={() => {}} />;' },
  { code: '<div role="treeitem" onClick={() => {}} />;' },
  /* Presentation is a special case role that indicates intentional static semantics */
  { code: '<div role="presentation" onClick={() => {}} />;' },
  { code: '<div role="presentation" onKeyDown={() => {}} />;' },
  /* HTML elements with an inherent, non-interactive role */
  { code: '<article onClick={() => {}} />;' },
  { code: '<article onDblClick={() => void 0} />;' },
  { code: '<aside onClick={() => {}} />;' },
  { code: '<blockquote onClick={() => {}} />;' },
  { code: '<body onClick={() => {}} />;' },
  { code: '<br onClick={() => {}} />;' },
  { code: '<canvas onClick={() => {}} />;' },
  { code: '<caption onClick={() => {}} />;' },
  { code: '<details onClick={() => {}} />;' },
  { code: '<dd onClick={() => {}} />;' },
  { code: '<dfn onClick={() => {}} />;' },
  { code: '<dir onClick={() => {}} />;' },
  { code: '<dl onClick={() => {}} />;' },
  { code: '<dt onClick={() => {}} />;' },
  { code: '<embed onClick={() => {}} />;' },
  { code: '<fieldset onClick={() => {}} />;' },
  { code: '<figcaption onClick={() => {}} />;' },
  { code: '<figure onClick={() => {}} />;' },
  { code: '<footer onClick={() => {}} />;' },
  { code: '<frame onClick={() => {}} />;' },
  { code: '<h1 onClick={() => {}} />;' },
  { code: '<h2 onClick={() => {}} />;' },
  { code: '<h3 onClick={() => {}} />;' },
  { code: '<h4 onClick={() => {}} />;' },
  { code: '<h5 onClick={() => {}} />;' },
  { code: '<h6 onClick={() => {}} />;' },
  { code: '<hr onClick={() => {}} />;' },
  { code: '<iframe onClick={() => {}} />;' },
  { code: '<img onClick={() => {}} />;' },
  { code: '<label onClick={() => {}} />;' },
  { code: '<legend onClick={() => {}} />;' },
  { code: '<li onClick={() => {}} />;' },
  { code: '<main onClick={() => void 0} />;' },
  { code: '<mark onClick={() => {}} />;' },
  { code: '<marquee onClick={() => {}} />;' },
  { code: '<menu onClick={() => {}} />;' },
  { code: '<meter onClick={() => {}} />;' },
  { code: '<nav onClick={() => {}} />;' },
  { code: '<ol onClick={() => {}} />;' },
  { code: '<optgroup onClick={() => {}} />;' },
  { code: '<output onClick={() => {}} />;' },
  { code: '<p onClick={() => {}} />;' },
  { code: '<pre onClick={() => {}} />;' },
  { code: '<progress onClick={() => {}} />;' },
  { code: '<ruby onClick={() => {}} />;' },
  { code: '<section onClick={() => {}} aria-label="Aa" />;' },
  { code: '<section onClick={() => {}} aria-labelledby="js_1" />;' },
  { code: '<summary onClick={() => {}} />;' },
  { code: '<table onClick={() => {}} />;' },
  { code: '<tbody onClick={() => {}} />;' },
  { code: '<tfoot onClick={() => {}} />;' },
  { code: '<th onClick={() => {}} />;' },
  { code: '<thead onClick={() => {}} />;' },
  { code: '<time onClick={() => {}} />;' },
  { code: '<tr onClick={() => {}} />;' },
  { code: '<video onClick={() => {}} />;' },
  { code: '<ul onClick={() => {}} />;' },
  /* HTML elements attributed with an abstract role */
  { code: '<div role="command" onClick={() => {}} />;' },
  { code: '<div role="composite" onClick={() => {}} />;' },
  { code: '<div role="input" onClick={() => {}} />;' },
  { code: '<div role="landmark" onClick={() => {}} />;' },
  { code: '<div role="range" onClick={() => {}} />;' },
  { code: '<div role="roletype" onClick={() => {}} />;' },
  { code: '<div role="sectionhead" onClick={() => {}} />;' },
  { code: '<div role="select" onClick={() => {}} />;' },
  { code: '<div role="structure" onClick={() => {}} />;' },
  { code: '<div role="widget" onClick={() => {}} />;' },
  { code: '<div role="window" onClick={() => {}} />;' },
  /* HTML elements attributed with a non-interactive role */
  { code: '<div role="alert" onClick={() => {}} />;' },
  { code: '<div role="alertdialog" onClick={() => {}} />;' },
  { code: '<div role="application" onClick={() => {}} />;' },
  { code: '<div role="article" onClick={() => {}} />;' },
  { code: '<div role="banner" onClick={() => {}} />;' },
  { code: '<div role="cell" onClick={() => {}} />;' },
  { code: '<div role="complementary" onClick={() => {}} />;' },
  { code: '<div role="contentinfo" onClick={() => {}} />;' },
  { code: '<div role="definition" onClick={() => {}} />;' },
  { code: '<div role="dialog" onClick={() => {}} />;' },
  { code: '<div role="directory" onClick={() => {}} />;' },
  { code: '<div role="document" onClick={() => {}} />;' },
  { code: '<div role="feed" onClick={() => {}} />;' },
  { code: '<div role="figure" onClick={() => {}} />;' },
  { code: '<div role="grid" onClick={() => {}} />;' },
  { code: '<div role="group" onClick={() => {}} />;' },
  { code: '<div role="heading" onClick={() => {}} />;' },
  { code: '<div role="img" onClick={() => {}} />;' },
  { code: '<div role="list" onClick={() => {}} />;' },
  { code: '<div role="listbox" onClick={() => {}} />;' },
  { code: '<div role="listitem" onClick={() => {}} />;' },
  { code: '<div role="log" onClick={() => {}} />;' },
  { code: '<div role="main" onClick={() => {}} />;' },
  { code: '<div role="marquee" onClick={() => {}} />;' },
  { code: '<div role="math" onClick={() => {}} />;' },
  { code: '<div role="menu" onClick={() => {}} />;' },
  { code: '<div role="menubar" onClick={() => {}} />;' },
  { code: '<div role="navigation" onClick={() => {}} />;' },
  { code: '<div role="note" onClick={() => {}} />;' },
  { code: '<div role="progressbar" onClick={() => {}} />;' },
  { code: '<div role="radiogroup" onClick={() => {}} />;' },
  { code: '<div role="region" onClick={() => {}} />;' },
  { code: '<div role="row" onClick={() => {}} />;' },
  { code: '<div role="rowgroup" onClick={() => {}} />;' },
  { code: '<div role="section" onClick={() => {}} />;' },
  { code: '<div role="search" onClick={() => {}} />;' },
  { code: '<div role="separator" onClick={() => {}} />;' },
  { code: '<div role="scrollbar" onClick={() => {}} />;' },
  { code: '<div role="status" onClick={() => {}} />;' },
  { code: '<div role="table" onClick={() => {}} />;' },
  { code: '<div role="tablist" onClick={() => {}} />;' },
  { code: '<div role="tabpanel" onClick={() => {}} />;' },
  { code: '<td onClick={() => {}} />;' },
  { code: '<div role="term" onClick={() => {}} />;' },
  { code: '<div role="timer" onClick={() => {}} />;' },
  { code: '<div role="toolbar" onClick={() => {}} />;' },
  { code: '<div role="tooltip" onClick={() => {}} />;' },
  { code: '<div role="tree" onClick={() => {}} />;' },
  { code: '<div role="treegrid" onClick={() => {}} />;' },
  // All the possible handlers
  { code: '<div onCopy={() => {}} />;' },
  { code: '<div onCut={() => {}} />;' },
  { code: '<div onPaste={() => {}} />;' },
  { code: '<div onCompositionEnd={() => {}} />;' },
  { code: '<div onCompositionStart={() => {}} />;' },
  { code: '<div onCompositionUpdate={() => {}} />;' },
  { code: '<div onChange={() => {}} />;' },
  { code: '<div onInput={() => {}} />;' },
  { code: '<div onSubmit={() => {}} />;' },
  { code: '<div onSelect={() => {}} />;' },
  { code: '<div onTouchCancel={() => {}} />;' },
  { code: '<div onTouchEnd={() => {}} />;' },
  { code: '<div onTouchMove={() => {}} />;' },
  { code: '<div onTouchStart={() => {}} />;' },
  { code: '<div onScroll={() => {}} />;' },
  { code: '<div onWheel={() => {}} />;' },
  { code: '<div onAbort={() => {}} />;' },
  { code: '<div onCanPlay={() => {}} />;' },
  { code: '<div onCanPlayThrough={() => {}} />;' },
  { code: '<div onDurationChange={() => {}} />;' },
  { code: '<div onEmptied={() => {}} />;' },
  { code: '<div onEncrypted={() => {}} />;' },
  { code: '<div onEnded={() => {}} />;' },
  { code: '<div onError={() => {}} />;' },
  { code: '<div onLoadedData={() => {}} />;' },
  { code: '<div onLoadedMetadata={() => {}} />;' },
  { code: '<div onLoadStart={() => {}} />;' },
  { code: '<div onPause={() => {}} />;' },
  { code: '<div onPlay={() => {}} />;' },
  { code: '<div onPlaying={() => {}} />;' },
  { code: '<div onProgress={() => {}} />;' },
  { code: '<div onRateChange={() => {}} />;' },
  { code: '<div onSeeked={() => {}} />;' },
  { code: '<div onSeeking={() => {}} />;' },
  { code: '<div onStalled={() => {}} />;' },
  { code: '<div onSuspend={() => {}} />;' },
  { code: '<div onTimeUpdate={() => {}} />;' },
  { code: '<div onVolumeChange={() => {}} />;' },
  { code: '<div onWaiting={() => {}} />;' },
  { code: '<div onLoad={() => {}} />;' },
  { code: '<div onError={() => {}} />;' },
  { code: '<div onAnimationStart={() => {}} />;' },
  { code: '<div onAnimationEnd={() => {}} />;' },
  { code: '<div onAnimationIteration={() => {}} />;' },
  { code: '<div onTransitionEnd={() => {}} />;' },
];

const neverValid = [
  { code: '<div onClick={() => void 0} />;', errors: [expectedError] },
  { code: '<div onClick={() => void 0} role={undefined} />;', errors: [expectedError] },
  { code: '<div onClick={() => void 0} {...props} />;', errors: [expectedError] },
  { code: '<div onKeyUp={() => void 0} aria-hidden={false} />;', errors: [expectedError] },
  /* Static elements; no inherent role */
  { code: '<a onClick={() => void 0} />', errors: [expectedError] },
  { code: '<a onClick={() => {}} />;', errors: [expectedError] },
  { code: '<a tabIndex="0" onClick={() => void 0} />', errors: [expectedError] },
  { code: '<area onClick={() => {}} />;', errors: [expectedError] },
  { code: '<acronym onClick={() => {}} />;', errors: [expectedError] },
  { code: '<address onClick={() => {}} />;', errors: [expectedError] },
  { code: '<applet onClick={() => {}} />;', errors: [expectedError] },
  { code: '<b onClick={() => {}} />;', errors: [expectedError] },
  { code: '<base onClick={() => {}} />;', errors: [expectedError] },
  { code: '<bdi onClick={() => {}} />;', errors: [expectedError] },
  { code: '<bdo onClick={() => {}} />;', errors: [expectedError] },
  { code: '<big onClick={() => {}} />;', errors: [expectedError] },
  { code: '<blink onClick={() => {}} />;', errors: [expectedError] },
  { code: '<center onClick={() => {}} />;', errors: [expectedError] },
  { code: '<cite onClick={() => {}} />;', errors: [expectedError] },
  { code: '<code onClick={() => {}} />;', errors: [expectedError] },
  { code: '<col onClick={() => {}} />;', errors: [expectedError] },
  { code: '<colgroup onClick={() => {}} />;', errors: [expectedError] },
  { code: '<content onClick={() => {}} />;', errors: [expectedError] },
  { code: '<data onClick={() => {}} />;', errors: [expectedError] },
  { code: '<del onClick={() => {}} />;', errors: [expectedError] },
  { code: '<div onClick={() => {}} />;', errors: [expectedError] },
  { code: '<em onClick={() => {}} />;', errors: [expectedError] },
  { code: '<font onClick={() => {}} />;', errors: [expectedError] },
  { code: '<frameset onClick={() => {}} />;', errors: [expectedError] },
  { code: '<head onClick={() => {}} />;', errors: [expectedError] },
  { code: '<header onClick={() => {}} />;', errors: [expectedError] },
  { code: '<hgroup onClick={() => {}} />;', errors: [expectedError] },
  { code: '<html onClick={() => {}} />;', errors: [expectedError] },
  { code: '<i onClick={() => {}} />;', errors: [expectedError] },
  { code: '<ins onClick={() => {}} />;', errors: [expectedError] },
  { code: '<kbd onClick={() => {}} />;', errors: [expectedError] },
  { code: '<keygen onClick={() => {}} />;', errors: [expectedError] },
  { code: '<map onClick={() => {}} />;', errors: [expectedError] },
  { code: '<meta onClick={() => {}} />;', errors: [expectedError] },
  { code: '<noembed onClick={() => {}} />;', errors: [expectedError] },
  { code: '<noscript onClick={() => {}} />;', errors: [expectedError] },
  { code: '<object onClick={() => {}} />;', errors: [expectedError] },
  { code: '<param onClick={() => {}} />;', errors: [expectedError] },
  { code: '<picture onClick={() => {}} />;', errors: [expectedError] },
  { code: '<q onClick={() => {}} />;', errors: [expectedError] },
  { code: '<rp onClick={() => {}} />;', errors: [expectedError] },
  { code: '<rt onClick={() => {}} />;', errors: [expectedError] },
  { code: '<rtc onClick={() => {}} />;', errors: [expectedError] },
  { code: '<s onClick={() => {}} />;', errors: [expectedError] },
  { code: '<samp onClick={() => {}} />;', errors: [expectedError] },
  { code: '<script onClick={() => {}} />;', errors: [expectedError] },
  { code: '<section onClick={() => {}} />;', errors: [expectedError] },
  { code: '<small onClick={() => {}} />;', errors: [expectedError] },
  { code: '<source onClick={() => {}} />;', errors: [expectedError] },
  { code: '<spacer onClick={() => {}} />;', errors: [expectedError] },
  { code: '<span onClick={() => {}} />;', errors: [expectedError] },
  { code: '<strike onClick={() => {}} />;', errors: [expectedError] },
  { code: '<strong onClick={() => {}} />;', errors: [expectedError] },
  { code: '<style onClick={() => {}} />;', errors: [expectedError] },
  { code: '<sub onClick={() => {}} />;', errors: [expectedError] },
  { code: '<sup onClick={() => {}} />;', errors: [expectedError] },
  { code: '<title onClick={() => {}} />;', errors: [expectedError] },
  { code: '<track onClick={() => {}} />;', errors: [expectedError] },
  { code: '<tt onClick={() => {}} />;', errors: [expectedError] },
  { code: '<u onClick={() => {}} />;', errors: [expectedError] },
  { code: '<var onClick={() => {}} />;', errors: [expectedError] },
  { code: '<wbr onClick={() => {}} />;', errors: [expectedError] },
  { code: '<xmp onClick={() => {}} />;', errors: [expectedError] },
  // Handlers
  { code: '<div onKeyDown={() => {}} />;', errors: [expectedError] },
  { code: '<div onKeyPress={() => {}} />;', errors: [expectedError] },
  { code: '<div onKeyUp={() => {}} />;', errors: [expectedError] },
  { code: '<div onClick={() => {}} />;', errors: [expectedError] },
  { code: '<div onMouseDown={() => {}} />;', errors: [expectedError] },
  { code: '<div onMouseUp={() => {}} />;', errors: [expectedError] },
  // Custom components
  { code: '<TestComponent onClick={doFoo} />', settings: componentsSettings, errors: [expectedError] },
];

const recommendedOptions = configs.recommended.rules[`jsx-a11y/${ruleName}`][1] || {};
ruleTester.run(`${ruleName}:recommended`, rule, {
  valid: [].concat(
    alwaysValid,
    // All the possible handlers
    { code: '<div onCopy={() => {}} />;' },
    { code: '<div onCut={() => {}} />;' },
    { code: '<div onPaste={() => {}} />;' },
    { code: '<div onCompositionEnd={() => {}} />;' },
    { code: '<div onCompositionStart={() => {}} />;' },
    { code: '<div onCompositionUpdate={() => {}} />;' },
    { code: '<div onFocus={() => {}} />;' },
    { code: '<div onBlur={() => {}} />;' },
    { code: '<div onChange={() => {}} />;' },
    { code: '<div onInput={() => {}} />;' },
    { code: '<div onSubmit={() => {}} />;' },
    { code: '<div onContextMenu={() => {}} />;' },
    { code: '<div onDblClick={() => {}} />;' },
    { code: '<div onDoubleClick={() => {}} />;' },
    { code: '<div onDrag={() => {}} />;' },
    { code: '<div onDragEnd={() => {}} />;' },
    { code: '<div onDragEnter={() => {}} />;' },
    { code: '<div onDragExit={() => {}} />;' },
    { code: '<div onDragLeave={() => {}} />;' },
    { code: '<div onDragOver={() => {}} />;' },
    { code: '<div onDragStart={() => {}} />;' },
    { code: '<div onDrop={() => {}} />;' },
    { code: '<div onMouseEnter={() => {}} />;' },
    { code: '<div onMouseLeave={() => {}} />;' },
    { code: '<div onMouseMove={() => {}} />;' },
    { code: '<div onMouseOut={() => {}} />;' },
    { code: '<div onMouseOver={() => {}} />;' },
    { code: '<div onSelect={() => {}} />;' },
    { code: '<div onTouchCancel={() => {}} />;' },
    { code: '<div onTouchEnd={() => {}} />;' },
    { code: '<div onTouchMove={() => {}} />;' },
    { code: '<div onTouchStart={() => {}} />;' },
    { code: '<div onScroll={() => {}} />;' },
    { code: '<div onWheel={() => {}} />;' },
    { code: '<div onAbort={() => {}} />;' },
    { code: '<div onCanPlay={() => {}} />;' },
    { code: '<div onCanPlayThrough={() => {}} />;' },
    { code: '<div onDurationChange={() => {}} />;' },
    { code: '<div onEmptied={() => {}} />;' },
    { code: '<div onEncrypted={() => {}} />;' },
    { code: '<div onEnded={() => {}} />;' },
    { code: '<div onError={() => {}} />;' },
    { code: '<div onLoadedData={() => {}} />;' },
    { code: '<div onLoadedMetadata={() => {}} />;' },
    { code: '<div onLoadStart={() => {}} />;' },
    { code: '<div onPause={() => {}} />;' },
    { code: '<div onPlay={() => {}} />;' },
    { code: '<div onPlaying={() => {}} />;' },
    { code: '<div onProgress={() => {}} />;' },
    { code: '<div onRateChange={() => {}} />;' },
    { code: '<div onSeeked={() => {}} />;' },
    { code: '<div onSeeking={() => {}} />;' },
    { code: '<div onStalled={() => {}} />;' },
    { code: '<div onSuspend={() => {}} />;' },
    { code: '<div onTimeUpdate={() => {}} />;' },
    { code: '<div onVolumeChange={() => {}} />;' },
    { code: '<div onWaiting={() => {}} />;' },
    { code: '<div onLoad={() => {}} />;' },
    { code: '<div onError={() => {}} />;' },
    { code: '<div onAnimationStart={() => {}} />;' },
    { code: '<div onAnimationEnd={() => {}} />;' },
    { code: '<div onAnimationIteration={() => {}} />;' },
    { code: '<div onTransitionEnd={() => {}} />;' },
    // Expressions should pass in recommended mode
    { code: '<div role={ROLE_BUTTON} onClick={() => {}} />;' },
    { code: '<div  {...this.props} role={this.props.role} onKeyPress={e => this.handleKeyPress(e)}>{this.props.children}</div>' },
    // Cases for allowExpressionValues set to true
    {
      code: '<div role={BUTTON} onClick={() => {}} />;',
      options: [{ allowExpressionValues: true }],
    },
    // Specific case for ternary operator with literals on both side
    {
      code: '<div role={isButton ? "button" : "link"} onClick={() => {}} />;',
      options: [{ allowExpressionValues: true }],
    },
    {
      code: '<div role={isButton ? "button" : LINK} onClick={() => {}} />;',
      options: [{ allowExpressionValues: true }],
      errors: [expectedError],
    },
    {
      code: '<div role={isButton ? BUTTON : LINK} onClick={() => {}} />;',
      options: [{ allowExpressionValues: true }],
      errors: [expectedError],
    },
  )
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),
  invalid: [].concat(
    neverValid,
  )
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),
});

ruleTester.run(`${ruleName}:strict`, rule, {
  valid: [].concat(
    alwaysValid,
  ).map(parserOptionsMapper),
  invalid: [].concat(
    neverValid,
    // All the possible handlers
    { code: '<div onContextMenu={() => {}} />;', errors: [expectedError] },
    { code: '<div onDblClick={() => {}} />;', errors: [expectedError] },
    { code: '<div onDoubleClick={() => {}} />;', errors: [expectedError] },
    { code: '<div onDrag={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragEnd={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragEnter={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragExit={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragLeave={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragOver={() => {}} />;', errors: [expectedError] },
    { code: '<div onDragStart={() => {}} />;', errors: [expectedError] },
    { code: '<div onDrop={() => {}} />;', errors: [expectedError] },
    { code: '<div onMouseEnter={() => {}} />;', errors: [expectedError] },
    { code: '<div onMouseLeave={() => {}} />;', errors: [expectedError] },
    { code: '<div onMouseMove={() => {}} />;', errors: [expectedError] },
    { code: '<div onMouseOut={() => {}} />;', errors: [expectedError] },
    { code: '<div onMouseOver={() => {}} />;', errors: [expectedError] },
    // Expressions should fail in strict mode
    { code: '<div role={ROLE_BUTTON} onClick={() => {}} />;', errors: [expectedError] },
    { code: '<div  {...this.props} role={this.props.role} onKeyPress={e => this.handleKeyPress(e)}>{this.props.children}</div>', errors: [expectedError] },
    // Cases for allowExpressionValues set to false
    {
      code: '<div role={BUTTON} onClick={() => {}} />;',
      options: [{ allowExpressionValues: false }],
      errors: [expectedError],
    },
    // Specific case for ternary operator with literals on both side
    {
      code: '<div role={isButton ? "button" : "link"} onClick={() => {}} />;',
      options: [{ allowExpressionValues: false }],
      errors: [expectedError],
    },
  ).map(parserOptionsMapper),
});