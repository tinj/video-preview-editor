

describe("Button Click Event Tests", function() {
  var spyEvent;

  beforeEach(function() {
    setUpHTMLFixture();
  });

  it ("should invoke the btnShowMessage click event.", function() {
    spyEvent = spyOnEvent('#btnShowMessage', 'click');
    $('#btnShowMessage').trigger( "click" );

    expect('click').toHaveBeenTriggeredOn('#btnShowMessage');
    expect(spyEvent).toHaveBeenTriggered();
  });

  it ("should invoke the btnHideMessage click event.", function() {
    spyEvent = spyOnEvent('#btnHideMessage', 'click');
    $('#btnHideMessage').trigger( "click" );

    expect('click').toHaveBeenTriggeredOn('#btnHideMessage');
    expect(spyEvent).toHaveBeenTriggered();
  });
});