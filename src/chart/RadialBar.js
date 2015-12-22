/**
 * @fileOverview 玉玦图
 */
import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Sector from '../shape/Sector';
import Layer from '../container/Layer';
import LodashUtils from '../util/LodashUtils';
import DOMUtils from '../util/DOMUtils';

const RADIAN = Math.PI / 180;

const RadialBar = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    className: PropTypes.string,

    component: PropTypes.object,

    labelOffsetRadius: PropTypes.number,
    clockWise: PropTypes.bool,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    maxAngle: PropTypes.number,
    minAngle: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({
      cx: PropTypes.number,
      cy: PropTypes.number,
      innerRadius: PropTypes.number,
      outerRadius: PropTypes.number,
      value: PropTypes.value
    })),

    hasLabel: PropTypes.bool,
    hasBackground: PropTypes.bool,

    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func
  },

  getDefaultProps () {
    return {
      // 数据
      data: [],
      labelOffsetRadius: 2,
      clockWise: true,
      startAngle: 0,
      minAngle: 0,
      onClick () {},
      onMouseEnter () {},
      onMouseLeave () {}
    };
  },

  getSectors () {
    const {cx, cy, innerRadius, outerRadius, startAngle, endAngle,
           data, minAngle, maxAngle, clockWise} = this.props;
    const maxValue = Math.max.apply(null, data.map(entry => entry.value));
    const absMinAngle = Math.abs(minAngle);
    const gapAngle = Math.abs(maxAngle) - absMinAngle;

    const sectors = data.map((entry) => {
      const _endAngle = (maxValue <= 0 || entry.value <= 0)
                        ? startAngle
                        : startAngle + (clockWise ? -1 : 1) * (absMinAngle + gapAngle * entry.value / maxValue);

      return {
        ...entry,
        cx, cy,
        clockWise,
        startAngle,
        endAngle: _endAngle
      };
    });

    return sectors;
  },

  getLabelPathArc (data, label, style) {
    const {labelOffsetRadius} = this.props;
    const {cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise} = data;
    const radius = clockWise ? innerRadius + labelOffsetRadius : Math.max(outerRadius - labelOffsetRadius, 0);

    if (radius <= 0) {return '';}

    const labelSize = DOMUtils.getStringSize(label, style);
    const deltaAngle = labelSize.width / (radius * RADIAN);
    let _startAngle, _endAngle;

    if (clockWise) {
      _startAngle = Math.min(endAngle + deltaAngle, startAngle);
      _endAngle = _startAngle - deltaAngle;
    } else {
      _startAngle = Math.max(endAngle - deltaAngle, startAngle);
      _endAngle = _startAngle + deltaAngle;
    }

    return `M${cx + radius * Math.cos(-RADIAN * _startAngle)}
            ${cy + radius * Math.sin(-RADIAN * _startAngle)}
            A${radius},${radius},0,
            ${deltaAngle >= 180 ? 1 : 0},
            ${clockWise ? 1 : 0},
            ${cx + radius * Math.cos(-RADIAN * _endAngle)},
            ${cy + radius * Math.sin(-RADIAN * _endAngle)}`;
  },


  renderSectors (sectors) {
    const {className, component, data, ...others} = this.props;

    return sectors.map((entry, i) => {
      const {value, ...rest} = entry;

      return component ? React.cloneElement(component, {
        ...others, ...rest,
        key: 'sector-' + i
      }) : React.createElement(Sector, {
        ...others, ...rest,
        key: 'sector-' + i
      });
    });
  },

  renderBackground (sectors) {
    const {startAngle, endAngle, clockWise} = this.props;

    return sectors.map((entry, i) => {
      const {value, ...rest} = entry;

      return (
        <Sector
          {...rest}
          fill='#f1f1f1'
          clockWise={clockWise}
          startAngle={startAngle}
          endAngle={endAngle}
          key={'sector-' + i}/>
      );
    });
  },

  renderLabels (sectors) {
    const {labelStyle} = this.props;

    return sectors.map((entry, i) => {
      const label = entry.value;
      const id = LodashUtils.getUniqueId('recharts-defs-');
      const style = labelStyle || {fontSize: 10, fill: '#000'};
      const path = this.getLabelPathArc(entry, label, style);

      const html =
        `<defs><path id='${id}' d='${path}'/></defs>
         <textPath xlink:href='#${id}'>${label}</textPath>`;

      return <text style={style} key={'label-' + i} dangerouslySetInnerHTML={{__html: html}}/>;
    });
  },

  render () {
    let {data, className, hasBackground, hasLabel} = this.props;

    if (!data || !data.length) {
      return;
    }
    const sectors = this.getSectors();

    return (
      <Layer className={'layer-radial-bar ' + (className || '')}>
        {hasBackground && (
          <Layer className={'layer-background'}>
            {this.renderBackground(sectors)}
          </Layer>
        )}

        <Layer className='laryer-sector'>
          {this.renderSectors(sectors)}
        </Layer>

        {hasLabel && (
          <Layer className='laryer-label'>
            {this.renderLabels(sectors)}
          </Layer>
        )}
      </Layer>
    );
  }
});

export default RadialBar;
