import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  TrendingUp,
  Trash2,
  AlertTriangle,
  Globe,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { http } from '@/utils/http_request';
import { RUTE_GET_PUBLIC_LINK_SINGLE, RUTE_PUBLIC_LINK_ACTIVATE } from '@/utils/Rutes';

interface AccountSettingsModalProps {
  account: {
    _id: string;
    external_id: string;
    name: string;
    number: string;
    broker: string;
    mt: string;
    currency: string;
    balance: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onDelete: (accountId: string) => Promise<void>;
}

export default function AccountSettingsModal({
  account,
  isOpen,
  onClose,
  onDelete,
}: AccountSettingsModalProps) {
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isPublicLinksOpen, setIsPublicLinksOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [publicIdentifier, setPublicIdentifier] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(
    null,
  );

  const { deletingAccount, refreshAccounts, setCurrentAccountNumber } = useMTAccounts();
  const wasDeleting = useRef(false);

  // Detect account deletion completion
  useEffect(() => {
    if (deletingAccount) wasDeleting.current = true;
    else if (wasDeleting.current && deletingAccount === null) {
      wasDeleting.current = false;
      onClose();
      refreshAccounts();
    }
  }, [deletingAccount, onClose, refreshAccounts]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleteConfirm) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, isDeleteConfirm]);

  // Load public link info
  useEffect(() => {
    if (isPublicLinksOpen && isOpen) {
      loadPublicLinkInfo();
    }
  }, [isPublicLinksOpen, isOpen]);

  const loadPublicLinkInfo = async () => {
    try {
      setLoading(true);
      const response = await http.get(`${RUTE_GET_PUBLIC_LINK_SINGLE}${account._id}`, {
        validateStatus: () => true,
      });

      if (response.status === 200) {
        const { name, isPublic: accountIsPublic } = response.data;
        setPublicIdentifier(name);
        setIsPublic(accountIsPublic);

        if (accountIsPublic) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const link = `${window.location.origin}/${user?.userName}/${name}`;
          setGeneratedLink(link);
        }
      } else if (response.status === 404) {
        setIsPublic(false);
        setGeneratedLink('');
        setPublicIdentifier('');
      }
    } catch (error) {
      console.error('Failed to load public link:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublicStatus = async () => {
    if (!publicIdentifier && !isPublic) {
      setMessage({ text: 'Please provide a public identifier first', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const newStatus = !isPublic;
      const response = await http.post(RUTE_PUBLIC_LINK_ACTIVATE, {
        accountId: account._id,
        isPublic: newStatus,
        publicIdentifier,
      });

      if (response.status === 200) {
        setIsPublic(newStatus);
        setMessage({
          text: newStatus ? 'Account is now public!' : 'Account is now private.',
          type: newStatus ? 'success' : 'info',
        });

        if (newStatus) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const link = `${window.location.origin}/${user?.userName}/${publicIdentifier}`;
          setGeneratedLink(link);
        } else {
          setGeneratedLink('');
        }
      }
    } catch (error) {
      setMessage({ text: 'Failed to update public status', type: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateRandomIdentifier = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPublicIdentifier(result);
  };

  const handleDelete = async () => {

    try {
      await onDelete(account.external_id);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
      <motion.div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'
          style={{ zIndex: 9999 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isDeleteConfirm && onClose()}
      >
        <motion.div
          className='relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden'
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-5 border-b border-slate-700 bg-slate-800/50'>
            <div className='space-y-1'>
              <h2 className='text-xl font-bold text-white'>Account Settings</h2>
              <p className='text-sm text-slate-400'>
                {account.broker} · {account.mt} · #{account.number}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='text-slate-400 hover:text-white'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          {/* Content */}
          <div className='p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]'>
            {deletingAccount ? (
              <div className='flex flex-col items-center justify-center py-12 space-y-4'>
                <Loader2 className='h-12 w-12 animate-spin text-emerald-500' />
                <p className='text-slate-400'>Deleting account...</p>
              </div>
            ) : (
              <>
                {/* Account Info Card */}
                <Card className='bg-slate-800 border-slate-700'>
                  <CardContent className='p-5 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold text-white'>{account.name}</h3>
                      <Badge variant='secondary' className='bg-slate-700 text-slate-200'>
                        {account.mt}
                      </Badge>
                    </div>
                    <div className='grid grid-cols-2 gap-4 pt-2'>
                      <div>
                        <div className='text-xs text-slate-500'>Balance</div>
                        <div className='text-lg font-semibold text-white'>
                          {account.currency} ${account.balance.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className='text-xs text-slate-500'>Broker</div>
                        <div className='text-lg font-semibold text-white'>{account.broker}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-slate-400'>Quick Actions</h4>

                  {/* View Metrics */}
                  <Link
                    to={`/?account=${account.number}`}
                    onClick={() => setCurrentAccountNumber(account.number)}
                    className='block'
                  >
                    <Card className='bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border-emerald-700/50 hover:border-emerald-600 transition-all cursor-pointer group'>
                      <CardContent className='p-4 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors'>
                            <TrendingUp className='h-5 w-5 text-emerald-400' />
                          </div>
                          <div>
                            <div className='font-semibold text-white'>View Metrics</div>
                            <div className='text-xs text-slate-400'>
                              See your trading performance
                            </div>
                          </div>
                        </div>
                        <ExternalLink className='h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors' />
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Public Link Toggle */}
                  <Card
                    className='bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer'
                    onClick={() => setIsPublicLinksOpen(!isPublicLinksOpen)}
                  >
                    <CardContent className='p-4 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-500/20 rounded-lg'>
                          {isPublic ? (
                            <Globe className='h-5 w-5 text-blue-400' />
                          ) : (
                            <Lock className='h-5 w-5 text-slate-400' />
                          )}
                        </div>
                        <div>
                          <div className='font-semibold text-white'>Public Link</div>
                          <div className='text-xs text-slate-400'>
                            {isPublic ? 'Link is active' : 'Share your performance'}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isPublicLinksOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className='h-5 w-5 text-slate-400'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Public Link Settings (Expandable) */}
                  <AnimatePresence>
                    {isPublicLinksOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='overflow-hidden'
                      >
                        <Card className='bg-slate-800/50 border-slate-700'>
                          <CardContent className='p-4 space-y-4'>
                            {message && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-lg text-sm ${
                                  message.type === 'success'
                                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                    : message.type === 'error'
                                      ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                                      : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                                }`}
                              >
                                {message.text}
                              </motion.div>
                            )}

                            {/* Identifier Input */}
                            <div className='space-y-2'>
                              <label className='text-xs font-medium text-slate-400'>
                                Public Identifier
                              </label>
                              <div className='flex gap-2'>
                                <input
                                  type='text'
                                  value={publicIdentifier}
                                  onChange={e =>
                                    setPublicIdentifier(
                                      e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''),
                                    )
                                  }
                                  disabled={isPublic}
                                  placeholder='custom-identifier'
                                  className='flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 disabled:opacity-50'
                                />
                                {!isPublic && (
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    onClick={generateRandomIdentifier}
                                    className='bg-slate-700 hover:bg-slate-600'
                                  >
                                    Random
                                  </Button>
                                )}
                              </div>
                              <p className='text-xs text-slate-500'>
                                Letters, numbers, dots, underscores, and hyphens only
                              </p>
                            </div>

                            {/* Toggle Public */}
                            <div className='flex items-center justify-between p-3 bg-slate-900/50 rounded-lg'>
                              <div>
                                <div className='text-sm font-medium text-white'>
                                  Make Account Public
                                </div>
                                <div className='text-xs text-slate-400'>
                                  Allow others to view your performance
                                </div>
                              </div>
                              <Button
                                variant={isPublic ? 'default' : 'secondary'}
                                size='sm'
                                onClick={togglePublicStatus}
                                disabled={loading}
                                className={
                                  isPublic
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-slate-700 hover:bg-slate-600'
                                }
                              >
                                {loading ? (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                ) : isPublic ? (
                                  'Disable'
                                ) : (
                                  'Enable'
                                )}
                              </Button>
                            </div>

                            {/* Generated Link */}
                            {generatedLink && (
                              <div className='space-y-2'>
                                <label className='text-xs font-medium text-slate-400'>
                                  Your Public Link
                                </label>
                                <div className='flex gap-2'>
                                  <input
                                    type='text'
                                    value={generatedLink}
                                    readOnly
                                    className='flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300'
                                  />
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    onClick={copyLink}
                                    className='bg-slate-700 hover:bg-slate-600'
                                  >
                                    {copied ? (
                                      <Check className='h-4 w-4 text-emerald-400' />
                                    ) : (
                                      <Copy className='h-4 w-4' />
                                    )}
                                  </Button>
                                  <a
                                    href={generatedLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center justify-center h-8 px-3 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors'
                                  >
                                    <ExternalLink className='h-4 w-4' />
                                  </a>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Danger Zone */}
                <div className='pt-4 space-y-3'>
                  <h4 className='text-sm font-medium text-slate-400 flex items-center gap-2'>
                    <AlertTriangle className='h-4 w-4 text-amber-500' />
                    Danger Zone
                  </h4>

                  {isDeleteConfirm ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='space-y-4'
                    >
                      <Card className='bg-rose-950/30 border-rose-800/50'>
                        <CardContent className='p-4 space-y-3'>
                          <div className='flex items-start gap-3'>
                            <AlertTriangle className='h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5' />
                            <div className='space-y-1'>
                              <div className='font-semibold text-white'>
                                Are you absolutely sure?
                              </div>
                              <div className='text-sm text-slate-300'>
                                This action cannot be undone. This will permanently delete your
                                account <span className='font-medium text-white'>{account.name}</span>{' '}
                                and remove all associated data.
                              </div>
                            </div>
                          </div>
                          <div className='flex gap-3 pt-2'>
                            <Button
                              variant='destructive'
                              onClick={handleDelete}
                              className='flex-1 bg-rose-600 hover:bg-rose-500'
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Yes, delete account
                            </Button>
                            <Button
                              variant='secondary'
                              onClick={() => setIsDeleteConfirm(false)}
                              className='flex-1 bg-slate-700 hover:bg-slate-600'
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <Button
                      variant='outline'
                      onClick={() => setIsDeleteConfirm(true)}
                      className='w-full border-rose-800/50 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-700'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete Account
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

