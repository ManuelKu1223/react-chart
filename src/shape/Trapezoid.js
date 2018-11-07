/**
 * @fileOverview Rectangle
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'react-smooth';
import pureRender from '../util/PureRender';
import { PRESENTATION_ATTRIBUTES, EVENT_ATTRIBUTES, getPresentationAttributes,
  filterEventAttributes } from '../util/ReactUtils';

const getTrapezoidPath = (x, y, upperWidth, lowerWidth, height) => {
  const widthGap = upperWidth - lowerWidth;
  let path;
  path = `M ${x},${y}`;
  path += `L ${x + upperWidth},${y}`;
  path += `L ${x + upperWidth - widthGap / 2},${y + height}`;
  path += `L ${x + upperWidth - widthGap / 2 - lowerWidth},${y + height}`;
  path += `L ${x},${y} Z`;
  return path;
};

@pureRender
class Trapezoid extends Component {

  static displayName = 'Trapezoid';

  static propTypes = {
    ...PRESENTATION_ATTRIBUTES,
    ...EVENT_ATTRIBUTES,
    className: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    upperWidth: PropTypes.number,
    lowerWidth: PropTypes.number,
    height: PropTypes.number,

    isAnimationActive: PropTypes.bool,
    isUpdateAnimationActive: PropTypes.bool,
    animationBegin: PropTypes.number,
    animationDuration: PropTypes.number,
    animationEasing: PropTypes.oneOf(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']),
  };

  static defaultProps = {
    x: 0,
    y: 0,
    upperWidth: 0,
    lowerWidth: 0,
    height: 0,
    isAnimationActive: false,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
  };

  state = {
    totalLength: -1,
  };

  /* eslint-disable  react/no-did-mount-set-state */
  componentDidMount() {
    if (this.node && this.node.getTotalLength) {
      try {
        const totalLength = this.node.getTotalLength();

        if (totalLength) {
          this.setState({
            totalLength,
          });
        }
      } catch (err) {
        // calculate total length error
      }
    }

  }

  render() {
    const { x, y, upperWidth, lowerWidth, height, className } = this.props;
    const { totalLength } = this.state;
    const { animationEasing, animationDuration, animationBegin,
      isAnimationActive, isUpdateAnimationActive } = this.props;

    if (x !== +x || y !== +y ||
      upperWidth !== +upperWidth || lowerWidth !== +lowerWidth || height !== +height
      || (upperWidth === 0 && lowerWidth === 0) || height === 0) { return null; }

    const layerClass = classNames('recharts-trapezoid', className);

    if (!isUpdateAnimationActive) {
      return (<g>
        <path
          {...getPresentationAttributes(this.props)}
          {...filterEventAttributes(this.props)}
          className={layerClass}
          d={getTrapezoidPath(x, y, upperWidth, lowerWidth, height)}
        />
      </g>);
    }

    return (
      <Animate
        canBegin={totalLength > 0}
        from={{ width, height, x, y }}
        to={{ width, height, x, y }}
        duration={animationDuration}
        animationEasing={animationEasing}
        isActive={isUpdateAnimationActive}
      >
        {
        ({ width: currWidth, height: currHeight, x: currX, y: currY }) => (
          <Animate
            canBegin={totalLength > 0}
            from={`0px ${totalLength === -1 ? 1 : totalLength}px`}
            to={`${totalLength}px 0px`}
            attributeName="strokeDasharray"
            begin={animationBegin}
            duration={animationDuration}
            isActive={isAnimationActive}
            easing={animationEasing}
          >
            <path
              {...getPresentationAttributes(this.props)}
              {...filterEventAttributes(this.props)}
              className={layerClass}
              d={getTrapezoidPath(currX, currY, currWidth, currHeight, radius)}
              ref={(node) => { this.node = node; }}
            />
          </Animate>
        )
      }
      </Animate>
    );
  }
}

export default Trapezoid;
