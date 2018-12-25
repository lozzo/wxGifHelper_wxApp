import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({
  classes: ['num-class', 'desc-class', 'thumb-class', 'title-class', 'price-class', 'origin-price-class'],
  mixins: [link],
  props: {
    tag: String,
    num: String,
    desc: String,
    thumb: String,
    title: String,
    region: String,
    centered: Boolean,
    lazyLoad: Boolean,
    thumbLink: String,
    originPrice: String,
    thumbMode: {
      type: String,
      value: 'scaleToFill'
    },
    currency: {
      type: String,
      value: '地区'
    }
  },
  methods: {
    onClickThumb: function onClickThumb() {
      this.jumpLink('thumbLink');
    }
  }
});