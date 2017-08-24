import { UnblockedPage } from './app.po';

describe('unblocked App', function() {
  let page: UnblockedPage;

  beforeEach(() => {
    page = new UnblockedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
