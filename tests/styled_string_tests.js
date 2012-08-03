var test = require('./testutils.js')
  , expect = test.expect
  , StyledString = require('../lib/styled_string.js')

describe('StyledString', function(){
    it('instantiates', function(){
        StyledString('abc')
    })
    it('has length', function(){
        expect(StyledString('abc').length).to.equal(3)
    })
    it('has attributes', function(){
        var s = StyledString('abc', {foreground: 'red'})
        expect(s.attrs.foreground).to.equal('red')
    })
    it('can substring', function(){
        var s = StyledString('abc', {foreground: 'red'})
        var s1 = s.substring(1)
        expect(s1.str).to.equal('bc')
        expect(s1.length).to.equal(2)
        expect(s1.attrs.foreground).to.equal('red')
    })
    it('has substr too', function(){
        var s = StyledString('abc')
        expect(s.substr === s.substring).to.be.ok
    })
    it('can substring a compound string (1 arg)', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        expect(s3.substring(2).toString()).to.equal('\033[31mc\033[0m\033[34mdef\033[0m')
        var s4 = s1.concat(s2)
        expect(s4.substring(4).toString()).to.equal('\033[34mef\033[0m')
    })
    it('can substring a compound string (2 args)', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        expect(s3.substring(1, 3).toString()).to.equal('\033[31mbc\033[0m')
        expect(s3.substring(2, 5).toString()).to.equal('\033[31mc\033[0m\033[34mde\033[0m')
        expect(s3.substring(3, 5).toString()).to.equal('\033[34mde\033[0m')
        expect(s3.substring(4, 6).toString()).to.equal('\033[34mef\033[0m')
        expect(s3.substring(4, 100).toString()).to.equal('\033[34mef\033[0m')
        expect(s3.substring(0, 100).toString()).to.equal('\033[31mabc\033[0m\033[34mdef\033[0m')
    })
    it('can match', function(){
        var s = StyledString('abc', {foreground: 'red'})
        expect(s.match(/bc$/)).not.to.equal(null)
    })
    it('can concat (and return a compound string)', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        expect(s3.str).to.equal(null)
        expect(s3.length).to.equal(6)
        expect(s3.children).to.deep.equal([s1, s2])
    })
    it('will append more children on concat for a compound string', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        var s4 = StyledString('ghi')
        var s5 = s3.concat(s4)
        expect(s5.children).to.deep.equal([s1, s2, s4])
    })
    it('encodes foreground color', function(){
        var s = StyledString('abc', {foreground: 'red'})
        expect(s.toString()).to.equal("\033[31mabc\033[0m")
    })
    it('encodes display attributes', function(){
        var s = StyledString('abc', {display: 'bright'})
        expect(s.toString()).to.equal("\033[1mabc\033[0m")
    })
    it('encodes background color', function(){
        var s = StyledString('abc', {background: 'red'})
        expect(s.toString()).to.equal("\033[41mabc\033[0m")
    })
    it('gives string from compound string', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        expect(s3.toString()).to.equal("\033[31mabc\033[0m\033[34mdef\033[0m")
    })
    it('tells you instanceof correctly', function(){
        expect(StyledString('abc') instanceof StyledString).to.be.ok
    })
    it('can split', function(){
        var s = StyledString('abc\ndef', {foreground: 'red'})
        var ss = s.split('\n')
        expect(ss[0] instanceof StyledString).to.be.ok
        expect(ss[0].attrs.foreground).to.equal('red')
        expect(ss[1] instanceof StyledString).to.be.ok
        expect(ss[1].attrs.foreground).to.equal('red')
    })
    it('can split with compound string', function(){
        var s1 = StyledString('abc,', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        var ss = s3.split(',')
        expect(ss[0].toString()).to.equal('\033[31mabc\033[0m')
        expect(ss[1].toString()).to.equal('\033[34mdef\033[0m')
    })
    it('shouldnt split on non-char boundry', function(){
        var s1 = StyledString('abc', {foreground: 'red'})
        var s2 = StyledString('def', {foreground: 'blue'})
        var s3 = s1.concat(s2)
        var ss = s3.split(',')
        expect(ss.length).to.equal(1)
    })
})