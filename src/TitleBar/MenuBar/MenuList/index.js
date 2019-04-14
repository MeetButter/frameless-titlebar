import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import SubMenu, { SubMenuLabelStyle } from './SubMenu';
import { defaultMenuItem } from '../../utils';
import css from './styles.css';
import MenuListContainer from './MenuListContainer';

const styles = {
  Wrapper: {
    zIndex: 8,
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    bottom: 0
  },
  FoldOut: {
    background: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0
  },
  MenuPane: {
    pointerEvents: 'all',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  MenuFoldOut: {
    paddingTop: 5,
    paddingBottom: 5
  }
}

class MenuList extends Component {
  constructor(props) {
    super(props);
    this._generateMenu = this._generateMenu.bind(this);
  }

  _generateMenu(menu = []) {
    const { theme } = this.props;
    return menu.map((menuItem, i) => {
      if (menuItem.submenu || (menuItem.type && menuItem.type.toLowerCase() === 'submenu')) {
        const menuWidth = this.props.rect.left + theme.menuWidth;
        const windowWidth = window.innerWidth;
        let renderSide = 'right';
        let right = menuWidth + theme.menuWidth;

        // Render menu to the left if the right side of the
        // current menu is greater than the current window width
        if (right > windowWidth && theme.menuWidth < this.props.rect.left) {
          renderSide = 'left';
          right = menuWidth - theme.menuWidth;
        }

        return (
          <SubMenu
            key={`${i}${menuItem.label}`}
            level={1}
            right={right}
            renderSide={renderSide}
            theme={theme}
            menuRef={this.props.menuRef}
            changeCheckState={this.props.changeCheckState}
            menuItem={{ ...defaultMenuItem, ...menuItem, type: 'submenu' }}
            path={this.props.vertical ? [...this.props.path, i, 'submenu'] : [...this.props.path, 'submenu', i, 'submenu']}
          />
        );
      }
      return (
        <MenuItem
          key={`${i}${menuItem.label}`}
          menuItem={{ ...defaultMenuItem, ...menuItem }}
          changeCheckState={this.props.changeCheckState}
          menuRef={this.props.menuRef}
          theme={theme}
          indx={i}
          path={this.props.vertical ? [...this.props.path] : [...this.props.path, 'submenu']}
        />
      );
    });
  }

  render() {
    const {
      submenu,
      rect,
      theme
    } = this.props;

    return (
      <div
        style={{
          ...styles.Wrapper,
          top: `${rect.bottom}px`
        }}
      >
        <div
          className={css.MenuListOverlay}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: theme.menuOverlayBackground,
            opacity: theme.menuOverlayOpacity
          }}
          tabIndex="-1"
        />
        <MenuListContainer
          theme={theme}
          rect={{left: rect.left, top: 0}}
        >
          {
            (theme.menuStyle === 'vertical' && theme.menuSubLabelHeaders) &&
              <div
                style={{
                  ...SubMenuLabelStyle,
                  color: theme.menuSubLabelColor
                }}
                key="main-menu-sublabel"
              >
                Menu
              </div>
          }
          {this._generateMenu(submenu)}
        </MenuListContainer>
      </div>
    );
  }
}

MenuList.propTypes = {
  submenu: PropTypes.array,
  path: PropTypes.array,
  rect: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  changeCheckState: PropTypes.func
};

MenuList.defaultProps = {
  submenu: [],
  path: [],
  changeCheckState: () => {}
};

export default MenuList;
