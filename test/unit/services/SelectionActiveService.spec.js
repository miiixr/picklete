describe("SelectionActiveService", () => {
  it('save SelectionActive', async (done) => {

    // 每次更新皆刪除重建 SelectionActive
    try {

      let selectionActives = [
        {
          type: 'oneLong',
          Images: [{
            type: '1100X160',
            link: '',
            path: ''
          }]
        },{
          type: 'oneBig',
          Images: [{
            type: '1100X350',
            link: '',
            path: ''
          }]
        },{
          type: 'two',
          Images: [{
            type: '545X350',
            link: '',
            path: ''
          },{
            type: '545X350',
            link: '',
            path: ''
          }]
        },{
          type: 'three',
          Images: [{
            type: '360X240',
            link: '',
            path: ''
          },{
            type: '360X240',
            link: '',
            path: ''
          },{
            type: '360X240',
            link: '',
            path: ''
          }]
        }
      ];

      let result = await SelectionActiveService.save(selectionActives);

      result.success.should.be.true;

    } catch (e) {
      done(e);
    }
  });
});
