import { Link } from 'react-router'
import { Menu, Icon } from 'antd'
import { menuData as allMenu } from '@/config/menuData'
import React, { PureComponent } from 'react';


const SubMenu = Menu.SubMenu;
class PlanMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            current: 'index',
            collapsed: false,
            mode: 'horizontal',
        }
    }
    handleClick = (e, special) => {
        this.setState({
            current: e.key || special,
        });
        const { keyPath } = e;
        const path = keyPath[keyPath.length - 1];
        const menu = keyPath.length>1?allMenu.find(ele => (ele.url === path)).children.find(e=>e.url===keyPath[0]).name:allMenu.find(ele => (ele.url === path)).name;
        this.props.toggleLocal(menu);
    }

    render() {
        return (
            <Menu
                theme="dark"
                onClick={this.handleClick}
                defaultOpenKeys={['']}
                selectedKeys={[this.state.current]}
                className="menu"
                mode={this.state.mode}
                style={{ lineHeight: '64px' }}
            >
                {
                    allMenu.map((subMenu) => {
                        if (subMenu.children && subMenu.children.length) {
                            return (
                                <SubMenu key={subMenu.url} title={<span><Icon type={subMenu.icon} /><span>{subMenu.name}</span></span>}>
                                    {subMenu.children.map(menu => (
                                        <Menu.Item key={menu.url}><Link to={`/${subMenu.url}/${menu.url}`}>{menu.name}</Link></Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        }
                        return (
                            <Menu.Item key={subMenu.url}>
                                <Link to={`/${subMenu.url}`}>
                                    <Icon type={subMenu.icon} /><span className="nav-text">{subMenu.name}</span>
                                </Link>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>

        )
    }
}


export default PlanMenu
