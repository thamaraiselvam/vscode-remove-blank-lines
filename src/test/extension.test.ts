import * as assert from 'assert';
import * as vscode from 'vscode';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

suite('Extension Remove Blank Lines', () => {
  test('Sample test', () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });

  test('should find extension installed', async () => {
    sleep(1000);
    const extension = await vscode.extensions.getExtension('thamaraiselvam.remove-blank-lines');
    assert.notEqual(extension, null);
  });
});
